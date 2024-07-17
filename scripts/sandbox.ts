import { setupSandbox } from "./utils/setup_sandbox";

setupSandbox()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });