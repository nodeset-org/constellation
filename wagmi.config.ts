import { defineConfig } from '@wagmi/cli';
import { hardhat } from '@wagmi/cli/plugins';

export default defineConfig({
  out: './index.ts',
  plugins: [
    hardhat({
      project: './',
      artifacts: "artifacts/contracts",
    }),
  ],
});
