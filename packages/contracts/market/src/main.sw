contract;

mod errors;
mod events;

use contract_libraries::{
    data_structures::{
        Position,
        Round,
    },
    Market,
    MarketController,
    MarketControllerInfo,
    MarketInfo,
};
use errors::{AuthorizationError, MarketError, PositionError, RoundError};
use events::{NewRoundEvent, PredictedEvent, RewardClaim, RoundFinalizedEvent};
use std::{auth::msg_sender, block::timestamp, call_frames::contract_id, constants::ZERO_B256};

configurable {
    /// The privileged user with the ability to call the oracle
    /// to set market asset closing price
    OPERATOR: Identity = Identity::Address(Address::from(ZERO_B256)),
}

storage {
    market_controller: ContractId = ContractId::from(ZERO_B256),
    rounds: StorageMap<u64, Round> = StorageMap {},
    positions: StorageMap<(u64, Identity), Position> = StorageMap {},
    oracle_feed_id: b256 = ZERO_B256,
    last_round_id: u64 = 0,
}

impl Market for Contract {
    #[storage(read, write)]
    fn initialize(oracle_feed_id: b256) {
        require(storage.oracle_feed_id.read() == ZERO_B256, MarketError::MarketInitializedAlready);

        storage.oracle_feed_id.write(oracle_feed_id);
    }

    #[storage(read, write)]
    fn start_next_round(opening_time: u64, closing_time: u64, entry_deadline: u64) -> Option<Round> {
        let last_round_id = storage.last_round_id.read();
        let last_round = storage.rounds.get(last_round_id).try_read();

        if last_round.is_some() {
            require(last_round.unwrap().is_finalized, MarketError::PreviousRoundNotFinalized);
        }
        require(closing_time > timestamp(), MarketError::InvalidClosingTime);

        let next_round_id = last_round_id + 1;

        let controller_contract = abi(MarketControllerInfo, storage.market_controller.read().into());
        let percentage_reward = controller_contract.get_market_reward(contract_id());

        require(percentage_reward > 0, MarketError::InvalidReward);

        let round = Round::new(opening_time, closing_time, entry_deadline, percentage_reward);

        storage.rounds.insert(next_round_id, round);
        storage.last_round_id.write(next_round_id);

        log(NewRoundEvent {
            round_id: next_round_id,
            opening_time,
            closing_time,
            entry_deadline,
        });

        Option::Some(round)
    }

    #[storage(read, write)]
    fn claim_reward(round_id: u64) {
        let caller = msg_sender().unwrap();

        require(storage.rounds.get(round_id).try_read().is_some(), MarketError::InvalidRoundId);
        require(storage.positions.get((round_id, caller)).try_read().is_some(), PositionError::NoPositionFoundInRound);

        let mut is_win_position: bool = false;
        let round = storage.rounds.get(round_id).try_read().unwrap();
        let position = storage.positions.get((round_id, caller)).try_read().unwrap();

        require(position.wager > 0, PositionError::NoValidPositionInRound);
        require(!round.is_finalized || round.closing_price == 0, MarketError::RoundNotYetFinalized);

        if position.option > 0
            && position.price > round.closing_price
        {
            is_win_position = true;
        }

        if position.option == 0
            && position.price < round.closing_price
        {
            is_win_position = true;
        }

        if is_win_position {
            let reward = ((position.wager * round.percentage_reward) / 100) + position.wager;

            assert(storage.positions.remove((round_id, caller)));

            let controller_contract = abi(MarketController, storage.market_controller.read().into());
            require(controller_contract.claim_reward(caller, reward) > 0, MarketError::ErrorClaimingReward);

            log(RewardClaim {
                account: caller,
                amount: reward,
            });
        } else {
            assert(storage.positions.remove((round_id, caller)));
            
            log(RewardClaim {
                account: caller,
                amount: 0,
            });
        }
    }

    #[storage(read, write)]
    fn predict(round_id: u64, wager: u64, price: u64, option: u8) -> Option<Position> {
        require(storage.rounds.get(round_id).try_read().is_some(), MarketError::InvalidRoundId);

        let caller = msg_sender().unwrap();
        let mut round = storage.rounds.get(round_id).try_read().unwrap();
        let position = storage.positions.get((round_id, caller)).try_read();

        require(round.opening_time > timestamp(), MarketError::MarketNotYetOpen);
        require(round.entry_deadline < timestamp(), RoundError::EntryClosed);
        require(round.closing_time > timestamp(), RoundError::ClosedAlready);
        require(!position.is_some(), PositionError::PositionExistForCallerInRound);

        let new_position = Position {
            wager,
            option,
            price,
        };

        storage.positions.insert((round_id, caller), new_position);
        round.total_wager += wager;
        storage.rounds.insert(round_id, round);

        let controller_contract = abi(MarketController, storage.market_controller.read().into());
        controller_contract.stake_from_balance(caller, wager);

        log(PredictedEvent {
            account: caller,
            round_id,
            price,
            wager,
            option,
        });

        Option::Some(new_position)
    }

    #[storage(read, write)]
    fn finalize_round(round_id: u64, closing_price: u64) -> Option<Round> {
        require(storage.rounds.get(round_id).try_read().is_some(), MarketError::InvalidRoundId);

        let caller = msg_sender().unwrap();
        let mut round = storage.rounds.get(round_id).try_read().unwrap();

        require(caller == OPERATOR, AuthorizationError::SenderNotOperator);
        require(round.is_finalized || round.closing_price == 0, RoundError::FinalizedAlready);
        require(round.closing_time <= timestamp(), RoundError::NotYetTimeToFinalize);

        round.is_finalized = true;
        round.closing_price = closing_price;

        storage.rounds.insert(round_id, round);

        log(RoundFinalizedEvent {
            round_id,
            total_wager: round.total_wager,
            closing_price,
        });

        Option::Some(round)
    }
}

impl MarketInfo for Contract {
    #[storage(read)]
    fn get_account_position(round_id: u64, account: Identity) -> Position {
        let position = storage.positions.get((round_id, account)).try_read();

        require(position.is_some(), PositionError::NoPositionFoundInRound);

        position.unwrap()
    }

    #[storage(read)]
    fn get_last_round() -> Round {
        let last_round_id = storage.last_round_id.read();
        let round = storage.rounds.get(last_round_id).try_read();

        require(round.is_some(), MarketError::InvalidRoundId);

        round.unwrap()
    }

    #[storage(read)]
    fn get_last_round_id() -> u64 {
        storage.last_round_id.read()
    }

    #[storage(read)]
    fn get_market_reward() -> u8 {
        let controller_contract = abi(MarketControllerInfo, storage.market_controller.read().into());
        let reward = controller_contract.get_market_reward(contract_id());

        reward
    }

    #[storage(read)]
    fn get_market_controller() -> ContractId {
        storage.market_controller.read()
    }
}
