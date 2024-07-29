import { ethers } from "hardhat";
import fs from 'fs';
import path from 'path';

async function main() {

    function computeSelector(functionSignature: string): string {
        // Compute the hash of the function signature
        const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(functionSignature));
        // Extract the selector, which are the first 4 bytes of the hash
        const selector = hash.slice(0, 10);
        return selector;
    }

    const contractsDir = path.join(__dirname, '../../artifacts/contracts');

    // Recursively get all contract JSON files from the contracts directory
    const getContractFiles = (dir: string): string[] => {
        let files = fs.readdirSync(dir);
        let contractFiles: string[] = [];

        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                contractFiles = contractFiles.concat(getContractFiles(filePath));
            } else if (file.endsWith('.json') && !file.endsWith('.dbg.json')) {
                contractFiles.push(filePath);
            }
        }

        return contractFiles;
    };

    const contractFiles = getContractFiles(contractsDir);

    // Process each contract file
    for (const contractFilePath of contractFiles) {
        const contractName = path.basename(contractFilePath, '.json');
        console.log(`Contract: ${contractName}`);

        // Read the contract artifact
        const artifact = JSON.parse(fs.readFileSync(contractFilePath, 'utf8'));

        // Loop through all ABI elements of the type function and print their selectors
        artifact.abi.filter((item: any) => item.type === 'function').forEach((func: any) => {

            const inputTypes = func.inputs.map((input: { type: string; components: any[]; }) => {
                // If the input type is tuple, construct the tuple type signature
                if (input.type === 'tuple') {
                  // Assuming the tuple components are available as input.components
                  // This will recursively get the types of the tuple's components
                  const tupleTypes = input.components.map(component => component.type).join(',');
                  return `(${tupleTypes})`;
                } else {
                  return input.type;
                }
              });
              
            const functionSignature = `${func.name}(${inputTypes.join(",")})`;
           // const signature = `${func.name}(${func.inputs.map((input: any) => input.type).join(',')})`;
            const selector = ethers.utils.id(functionSignature).slice(0, 10);
            console.log(`Function: ${functionSignature} - Selector: ${computeSelector(functionSignature)}`);
        });

        console.log(''); // Add a newline for readability between contracts
    }
}

// Call the main function and handle any errors
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
