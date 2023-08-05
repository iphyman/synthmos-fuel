library;

pub enum MarketControllerError {
    CannotDepositZeroAmount: (),
    NoBalanceForAccount: (),
    InsufficientAccountBalance: (),
    InvalidProtocolFee: (),
    InvalidMarketReward: (),
    FeeReceipientCannotBeNullAddress: (),
    FaucetAmountTooMuch: (),
    MarketAlreadyExist: (),
    CannotWithdrawZeroAmount: (),
    OnlySynthTokenAllowed: (),
    MarketBytecodeNotSet: (),
    MarketBytecodeMismatch: (),
    CannotClaimZeroAmount: (),
    MarketDoesNotExist: (),
}

pub enum AuthorizationError {
    CallerNotMarket: (),
    CallerNotManager: (),
}
