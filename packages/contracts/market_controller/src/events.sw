library;

pub struct MarketWhitelistedEvent {
    oracle_feed_id: b256,
    market_address: ContractId,
}

pub struct DepositEvent {
    account: Identity,
    amount: u64,
    created_on: u64,
}

pub struct WithdrawEvent {
    account: Identity,
    amount: u64,
    created_on: u64,
}

pub struct MarketByteCodeInitEvent {
    bytecode_root: b256
}

pub struct ProtocolFeeSetEvent {
    protocol_fee: u8
}

pub struct ProtocolFeeReceipient {
    receipient: Identity
}