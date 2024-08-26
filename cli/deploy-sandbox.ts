import { deployProtocol } from "../scripts/utils/deployment";
import { setDefaultParameters } from "../test/rocketpool/_helpers/defaults";
import { deployRocketPool } from "../test/rocketpool/_helpers/deployment";
import { createSigners, getRocketPool } from "../test/test";
import { RocketStorage } from "../typechain-types";



(async () => {
    const rs: RocketStorage = await deployRocketPool();
	await setDefaultParameters();

	const signers = await createSigners();
	const deployedProtocol = await deployProtocol(signers, rs.address, true);
	const rocketPool = await getRocketPool(deployedProtocol.directory);

})();