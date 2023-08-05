library;

pub enum MarketError {
    InvalidRoundId: (),
    InvalidClosingTime: (),
    MarketNotYetOpen: (),
    RoundNotYetFinalized: (),
    PreviousRoundNotFinalized: (),
    InvalidReward: (),
    ErrorClaimingReward: (),
    MarketInitializedAlready: (),
}

pub enum RoundError {
    NotYetTimeToFinalize: (),
    FinalizedAlready: (),
    EntryClosed: (),
    ClosedAlready: (),
}

pub enum PositionError {
    NoPositionFoundInRound: (),
    PositionExistForCallerInRound: (),
    NoValidPositionInRound: (),
}

pub enum AuthorizationError {
    SenderNotOperator: (),
}
