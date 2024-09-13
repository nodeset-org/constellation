import { deployDevUsingEnv} from "../utils/deployment";

 async function main() {
     const directory = await deployDevUsingEnv();
     console.log("Successfully deployed dev...");
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