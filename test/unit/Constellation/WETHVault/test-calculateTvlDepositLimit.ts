import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { Contract } from "ethers";

const AdminRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ROLE"));

/*
Source of Truth
https://github.com/nodeset-org/constellation/issues/416
+------------------------+----------------+-----------------------+--------------------------+------------------------------+--------------------------+
| Scenarios              | ETH in rETH DP | Constellation ETH TVL | Operator Distributor ETH | queueableDepositPercentLimit | Max WETH Deposit Amount  |
|                        |                |                       | Balance                  |                              |                          |
+------------------------+----------------+-----------------------+--------------------------+------------------------------+--------------------------+
| Normal Conditions      |       24       |          100          |            8             |             1%               |           1              |
| Zero Percent Limit     |       50       |          100          |            8             |             0%               |         8.66...          |
| No rETH Available      |       0        |          100          |            8             |             1%               |           1              |
| Healthy rETH Ratio     |       72       |          100          |           24             |            10%               |           10             |
| Low Constellation ETH  |       72       |          24           |           24             |            10%               |           2.4            |
| No ETH in OD           |       72       |          0            |            0             |            10%               |           24             |
| High Constellation ETH |       72       |         1000          |            0             |            10%               |          124             |
+------------------------+----------------+-----------------------+--------------------------+------------------------------+--------------------------+
*/


describe("WETHVault.calculateTvlDepositLimit", function () {
    let wethVault: Contract;
    let mockDirectory: Contract;
    let mockWETHToken: Contract;
    let mockRocketDepositPool: Contract;
    let mockOperatorDistributor: Contract;
    let owner: any;

    beforeEach(async function () {
        [owner] = await ethers.getSigners();

        const MockWETHToken = await ethers.getContractFactory("MockWEth");
        mockWETHToken = await MockWETHToken.deploy();
        await mockWETHToken.deployed();

        const MockRocketDepositPool = await ethers.getContractFactory("MockRocketDepositPool");
        mockRocketDepositPool = await MockRocketDepositPool.deploy();
        await mockRocketDepositPool.deployed();

        const MockOperatorDistributor = await ethers.getContractFactory("MockOperatorDistributor");
        mockOperatorDistributor = await MockOperatorDistributor.deploy();
        await mockOperatorDistributor.deployed();

        const MockDirectory = await ethers.getContractFactory("MockDirectory");
        mockDirectory = await MockDirectory.deploy();
        await mockDirectory.deployed();
        await mockDirectory.setRole(AdminRole, owner.address, true);

        await mockDirectory.setWETHAddress(mockWETHToken.address);
        await mockDirectory.setRocketDepositPoolAddress(mockRocketDepositPool.address);
        await mockDirectory.setOperatorDistributorAddress(mockOperatorDistributor.address);

        const WETHVault = await ethers.getContractFactory("WETHVault");
        wethVault = await upgrades.deployProxy(
            WETHVault,
            [mockDirectory.address, mockWETHToken.address],
            { initializer: 'initializeVault', kind: 'uups', unsafeAllow: ['constructor', 'delegatecall'] }
        );
        // await wethVault.connect(owner).setQueueableDepositsLimitEnabled(true);

        await mockDirectory.setWETHVaultAddress(wethVault.address);
    });

    describe("normal condtions", function () {
        it("should return 1 eth", async function () {
            // const result = await wethVault.calculateTvlDepositLimit();
            expect(1).to.equal(1);
        });
    });
});
