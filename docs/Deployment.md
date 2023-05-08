# Deployment

See `protocolFixture` in `/test/test.ts`

1. Contracts are deployed 
  First the Directory is deployed with the admin address, then everything else id deployed with a reference to it passed in the constructor. Also see Base.sol.
2. Directory is initialized with the addresses of the other contracts
3. Yield Distributor is initialized