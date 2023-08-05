library;

pub mod data_structures;
use ::data_structures::{Position, Round};

abi Market {
    /// Allows protocol managers to initialize new market
    #[storage(read, write)]
    fn initialize(oracle_feed_id: b256);
    /// This function is called by an operator account
    /// to start new prediction
    ///
    /// `opening_time` - timestamp of when round is open for participation
    /// `closing_time` - timestamp of when round is closed for participation
    /// `entry_deadline` - timestamp of when entry is no longer permitted into round
    ///
    /// Will revert if invalid unix timestamps are provided
    #[storage(read, write)]
    fn start_next_round(opening_time: u64, closing_time: u64, entry_deadline: u64) -> Option<Round>;

    /// Allows caller to claim reward for a position in `round_id`
    ///
    /// `round_id` the id of round to claim reward in
    #[storage(read, write)]
    fn claim_reward(round_id: u64);

    /// Allow caller to open a prediction position on the market
    ///
    /// ### Arguments
    ///
    /// `round_id` active round id
    /// `wager` amount staked for position
    /// `price` current asset price
    /// `option` 0-LOW, 1-HIGH
    #[storage(read, write)]
    fn predict(round_id: u64, wager: u64, price: u64, option: u8) -> Option<Position>;

    /// This function is called by protocol operator to finalize a prediction
    /// round accross all open markets and calling external oracle
    ///
    /// `round_id` active round id to finalize
    /// `closing_price` asset closing price for round
    #[storage(read, write)]
    fn finalize_round(round_id: u64, closing_price: u64) -> Option<Round>;
}

abi MarketInfo {
    /// Allow querying for an account's position in round
    ///
    /// `round_id` - id of round to fetch position in
    /// `account` - identity of account to fetch position for
    ///
    /// returns position for identity if it exists
    #[storage(read)]
    fn get_account_position(round_id: u64, account: Identity) -> Position;

    /// Allows querying for the last round data
    #[storage(read)]
    fn get_last_round() -> Round;

    /// Allows querying for the last round id
    #[storage(read)]
    fn get_last_round_id() -> u64;

    /// Allows querying for the market reward
    #[storage(read)]
    fn get_market_reward() -> u8;

    /// Allows querying for the controller address from market
    #[storage(read)]
    fn get_market_controller() -> ContractId;
}

abi MarketController {
    /// Allows manager to set market contract root bytecode hash
    #[storage(read, write)]
    fn initialize(market_bytecode_root: ContractId);

    /// Allows caller to initiate withdrawal request
    ///
    /// `amount` value to be sent to caller account
    ///
    /// Will throw if withdrawal requirements are not met
    #[storage(read, write)]
    fn withdraw(amount: u64);

    /// Allows any account to deposit the accepted token asset
    /// and be eligible to participate in the market
    ///
    /// Throws error when deposit requirements are not met
    #[payable, storage(read, write)]
    fn deposit();

    /// Allows for proxy deposit on behalf of another account
    ///
    /// `account_id` account to deposit for
    #[payable, storage(read, write)]
    fn deposit_for(account_id: Identity);

    /// Allows protocol managers to register new prediction market
    ///
    /// `oracle_feed_id` Pyth Newtwork Oracle feed id for asset
    #[storage(read, write)]
    fn whitelist_market(oracle_feed_id: b256, market_address: ContractId);

    /// Allows managers to set protocol fee
    #[storage(read, write)]
    fn set_protocol_fee(protocol_fee: u8);

    /// Allows managers to set protocol fee receiver account
    #[storage(read, write)]
    fn set_protocol_fee_recipient(receipient: Identity);

    /// Allows managers to set protocol reward token
    #[storage(read, write)]
    fn set_reward_token(reward_token: ContractId);

    /// This function allows protocol managers to manage
    /// the percentage rewards for winning positions
    /// in a market
    #[storage(read, write)]
    fn set_market_reward(market_address: ContractId, reward: u8);

    /// Allows users to utilize their deposited balance as wager
    /// on any market contract
    #[storage(read, write)]
    fn stake_from_balance(account: Identity, amount: u64);

    /// Allows rewarding winning position called from market
    /// contract
    #[storage(read, write)]
    fn claim_reward(account: Identity, amount: u64) -> u64;
}

abi MarketControllerInfo {
    /// Allows querying for the market contract address
    ///
    /// `oracle_feed_id` - Pyth Network Oracle feed id
    #[storage(read)]
    fn get_market(oracle_feed_id: b256) -> ContractId;

    /// Allows querying for the callers account balance
    /// of deposited asset on the controller
    #[storage(read)]
    fn get_balance() -> u64;

    /// Allows market contracts to fetch latest reward before each round
    #[storage(read)]
    fn get_market_reward(market_address: ContractId) -> u8;

    /// This function is for demo purposes, allows user to
    /// get some test synthmos token
    #[storage(read)]
    fn faucet(amount: u64);
}

abi SynthToken {
    /// Allows market controller to mint position reward
    #[storage(read, write)]
    fn mint_to(amount: u64, to: Identity);

    /// Allows market controller to burn staked wager
    #[storage(read, write)]
    fn burn(amount: u64);
}
