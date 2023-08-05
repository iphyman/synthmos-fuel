library;

/// Emitted when a user takes a position on the market
pub struct PredictedEvent {
    account: Identity,
    round_id: u64,
    price: u64,
    wager: u64,
    option: u8,
}

/// Emitted when a prediction round is finalized by an operator
pub struct RoundFinalizedEvent {
    round_id: u64,
    total_wager: u64,
    closing_price: u64,
}

/// Emitted when a new prediction round starts
pub struct NewRoundEvent {
    round_id: u64,
    opening_time: u64,
    closing_time: u64,
    entry_deadline: u64,
}

/// Emitted when an account claims reward for a winning position
pub struct RewardClaim {
    account: Identity,
    amount: u64,
}
