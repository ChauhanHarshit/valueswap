# dfx canister call cketh_ledger icrc1_transfer ' (record {to=record {owner = principal "rgtib-ktq4g-rjiya-aishg-mv2om-ey54m-jhyut-2tuaf-tvjyz-ml54r-lae"; subaccount=null}; fee=null; memo=null; from_subaccount=null; created_at_time=null; amount=500000000})'

# dfx canister call cketh_ledger icrc1_transfer ' (record {to=record {owner = principal "bkyz2-fmaaa-aaaaa-qaaaq-cai"; subaccount=null}; fee=null; memo=null; from_subaccount=null; created_at_time=null; amount=50000000000})'

dfx canister call cketh_ledger icrc1_balance_of "(record {owner=principal\"rgtib-ktq4g-rjiya-aishg-mv2om-ey54m-jhyut-2tuaf-tvjyz-ml54r-lae\"; subaccount=null})"