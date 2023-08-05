contract;

mod errors;
mod events;

use ::errors::{AuthorizationError, MarketControllerError};
use ::events::{
    DepositEvent,
    MarketByteCodeInitEvent,
    MarketWhitelistedEvent,
    ProtocolFeeReceipient,
    ProtocolFeeSetEvent,
    WithdrawEvent,
};
use contract_libraries::{MarketController, MarketControllerInfo, SynthToken};
use std::{
    auth::{
        caller_contract_id,
        msg_sender,
    },
    block::timestamp,
    call_frames::msg_asset_id,
    constants::ZERO_B256,
    context::msg_amount,
    external::bytecode_root,
};

configurable {
    /// The privileged user with the ability to contract market
    /// settings
    MANAGER: Identity = Identity::Address(Address::from(ZERO_B256)),
}

storage {
    /// Synth token address
    synth_token: ContractId = ContractId::from(ZERO_B256),
    /// User deposit balances
    balances: StorageMap<Identity, u64> = StorageMap {},
    /// An account to receive protocol fee
    fee_receipient: Identity = Identity::Address(Address::from(ZERO_B256)),
    /// Percentage charged as protocol fee
    protocol_fee: u8 = 5,
    /// A map of oracle feed id to market contract
    oracles_to_market: StorageMap<b256, ContractId> = StorageMap {},
    /// A map of market contract to oracle feed id markets
    markets_to_oracle: StorageMap<ContractId, b256> = StorageMap {},
    /// A map of market to percentage reward
    market_rewards: StorageMap<ContractId, u8> = StorageMap {},
    /// The market contract byte code hash
    market_contract_bytecode: Option<b256> = Option::None,
}

impl MarketController for Contract {
    #[storage(read, write)]
    fn initialize(market_bytecode_root: ContractId) {
        require(msg_sender().unwrap() == MANAGER, AuthorizationError::CallerNotManager);

        storage.market_contract_bytecode.write(Option::Some(market_bytecode_root.into()));

        log(MarketByteCodeInitEvent {
            bytecode_root: market_bytecode_root.into(),
        });
    }

    #[storage(read, write)]
    fn withdraw(amount: u64) {
        let caller = msg_sender().unwrap();
        let mut balance = storage.balances.get(caller).try_read().unwrap_or(0);

        require(balance > 0, MarketControllerError::NoBalanceForAccount);
        require(amount > 0, MarketControllerError::CannotWithdrawZeroAmount);
        require(balance >= amount, MarketControllerError::InsufficientAccountBalance);

        balance -= amount;
        storage.balances.insert(caller, balance);

        let synth_contract = abi(SynthToken, storage.synth_token.read().into());
        synth_contract.mint_to(amount, caller);
    }

    #[payable, storage(read, write)]
    fn deposit() {
        require(msg_asset_id() == storage.synth_token.read(), MarketControllerError::OnlySynthTokenAllowed);

        let amount = msg_amount();

        require(amount > 0, MarketControllerError::CannotDepositZeroAmount);

        let depositor = msg_sender().unwrap();
        let balance = storage.balances.get(depositor).try_read().unwrap_or(0) + amount;

        storage.balances.insert(depositor, balance);

        log(DepositEvent {
            account: depositor,
            amount,
            created_on: timestamp(),
        });
    }

    #[payable, storage(read, write)]
    fn deposit_for(account_id: Identity) {
        require(msg_asset_id() == storage.synth_token.read(), MarketControllerError::OnlySynthTokenAllowed);

        let amount = msg_amount();

        require(amount > 0, MarketControllerError::CannotDepositZeroAmount);

        let balance = storage.balances.get(account_id).try_read().unwrap_or(0) + amount;

        storage.balances.insert(account_id, balance);

        log(DepositEvent {
            account: account_id,
            amount,
            created_on: timestamp(),
        });
    }

    #[storage(read, write)]
    fn whitelist_market(oracle_feed_id: b256, market_address: ContractId) {
        require(msg_sender().unwrap() == MANAGER, AuthorizationError::CallerNotManager);
        require(storage.market_contract_bytecode.read().is_some(), MarketControllerError::MarketBytecodeNotSet);
        require(storage.market_contract_bytecode.read().unwrap() == bytecode_root(market_address), MarketControllerError::MarketBytecodeMismatch);

        storage.oracles_to_market.insert(oracle_feed_id, market_address);
        storage.markets_to_oracle.insert(market_address, oracle_feed_id);

        log(MarketWhitelistedEvent {
            oracle_feed_id,
            market_address,
        });
    }

    #[storage(read, write)]
    fn set_protocol_fee(protocol_fee: u8) {
        require(msg_sender().unwrap() == MANAGER, AuthorizationError::CallerNotManager);
        require(protocol_fee > 0, MarketControllerError::InvalidProtocolFee);

        storage.protocol_fee.write(protocol_fee);

        log(ProtocolFeeSetEvent { protocol_fee });
    }

    #[storage(read, write)]
    fn set_protocol_fee_recipient(receipient: Identity) {
        require(msg_sender().unwrap() == MANAGER, AuthorizationError::CallerNotManager);

        storage.fee_receipient.write(receipient);

        log(ProtocolFeeReceipient { receipient });
    }

    #[storage(read, write)]
    fn set_reward_token(reward_token: ContractId) {
        require(msg_sender().unwrap() == MANAGER, AuthorizationError::CallerNotManager);

        storage.synth_token.write(reward_token);
    }

    #[storage(read, write)]
    fn set_market_reward(market_address: ContractId, reward: u8) {
        require(msg_sender().unwrap() == MANAGER, AuthorizationError::CallerNotManager);

        storage.market_rewards.insert(market_address, reward);
    }

    #[storage(read, write)]
    fn stake_from_balance(account: Identity, amount: u64) {
        let mut account_balance = storage.balances.get(account).try_read().unwrap_or(0);

        require(storage.markets_to_oracle.get(caller_contract_id()).try_read().is_some(), AuthorizationError::CallerNotMarket);
        require(account_balance >= amount, MarketControllerError::InsufficientAccountBalance);

        account_balance -= amount;
        storage.balances.insert(account, account_balance);

        let synth_contract = abi(SynthToken, storage.synth_token.read().into());
        synth_contract.burn(amount);
    }

    #[storage(read, write)]
    fn claim_reward(account: Identity, amount: u64) -> u64 {
        require(storage.markets_to_oracle.get(caller_contract_id()).try_read().is_some(), AuthorizationError::CallerNotMarket);
        require(amount > 0, MarketControllerError::CannotClaimZeroAmount);

        let balance = storage.balances.get(account).try_read().unwrap_or(0) + amount;

        storage.balances.insert(account, balance);

        balance
    }
}

impl MarketControllerInfo for Contract {
    #[storage(read)]
    fn get_market(oracle_feed_id: b256) -> ContractId {
        storage.oracles_to_market.get(oracle_feed_id).try_read().unwrap()
    }

    #[storage(read)]
    fn get_balance() -> u64 {
        storage.balances.get(msg_sender().unwrap()).try_read().unwrap_or(0)
    }

    #[storage(read)]
    fn get_market_reward(market_address: ContractId) -> u8 {
        storage.market_rewards.get(market_address).try_read().unwrap_or(0)
    }

    #[storage(read)]
    fn faucet(amount: u64) {
        require(amount <= 1000, MarketControllerError::FaucetAmountTooMuch);

        let synth_contract = abi(SynthToken, storage.synth_token.read().into());
        synth_contract.mint_to(amount, msg_sender().unwrap());
    }
}
