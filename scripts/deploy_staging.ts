import { deployStagingUsingEnv } from "./environments/deploy_staging";

async function main() {
    await deployStagingUsingEnv(0);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });