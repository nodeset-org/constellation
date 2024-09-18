import { deployUsingEnv } from "../utils/deployment";

async function main() {
    const directory = await deployUsingEnv('staging');
    console.log("Successfully deployed staging...");
    console.log("Directory address", directory?.address);
    console.log(await directory?.getProtocol())
    console.log(await directory?.getRocketIntegrations())
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });