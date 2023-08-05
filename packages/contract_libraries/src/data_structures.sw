library;

pub struct Position {
    //The amount to stake for this position
    wager: u64,
    //Either 0-Low or 1-High
    option: u8,
    //The asset price to lock for this position
    price: u64,
}

pub struct Round {
    //Block timestamp at which the market round opens
    opening_time: u64,
    //Block timestamp at which the market round closes
    //The Oracle is called after this time or block height
    //is past
    closing_time: u64,
    //Block timestamp after which a new position cannot be opened
    entry_deadline: u64,
    //The asset closing price from Oracle
    closing_price: u64,
    //The total amount staked by users for this round
    total_wager: u64,
    //The percentage rewarded as profit to each winning position in round
    percentage_reward: u8,
    //True if the oracle has been called by the operator
    is_finalized: bool,
}

impl Round {
    pub fn new(
        opening_time: u64,
        closing_time: u64,
        entry_deadline: u64,
        percentage_reward: u8,
    ) -> Self {
        Round {
            opening_time,
            closing_time,
            entry_deadline,
            percentage_reward,
            total_wager: 0,
            closing_price: 0,
            is_finalized: false,
        }
    }
}
