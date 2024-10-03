import { deployUsingEnv } from "../utils/deployment";


async function main() {
    const directory = await deployUsingEnv('prod');
    console.log("Successfully deployed production...");
    console.log("Directory address", directory?.address);
    console.log(await directory?.getProtocol())
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });