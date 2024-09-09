import { deployToNetworkUsingEnv } from './deploy-to-network';

async function main() {
  await deployToNetworkUsingEnv('.env.prod');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
