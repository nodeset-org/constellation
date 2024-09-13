import { deployStagingUsingEnv } from "./environments/deploy_staging";

async function main() {
    const directory = await deployStagingUsingEnv(0);
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