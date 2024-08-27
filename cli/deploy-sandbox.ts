import { deployProtocol } from "../scripts/utils/deployment";
import { setDefaultParameters } from "../test/rocketpool/_helpers/defaults";
import { deployRocketPool } from "../test/rocketpool/_helpers/deployment";
import { createSigners, getRocketPool } from "../test/test";
import { RocketStorage } from "../typechain-types";



(async () => {
    const rs: RocketStorage = await deployRocketPool();
	await setDefaultParameters();

	const signers = await createSigners();

	// keccak256(abi.encodePacked("contract.address.rocketTokenRPL"))
    const identifier = 'rocketTokenRPL';
    const rocketTokenAddressKey =  ethers.utils.solidityKeccak256(["string"], [`contract.address${identifier}`]);
    const rocketToken = await rs.getAddress(rocketTokenAddressKey);

	const deployedProtocol = await deployProtocol(signers, rs.address, rocketToken, true);
	const rocketPool = await getRocketPool(deployedProtocol.directory);

})();


