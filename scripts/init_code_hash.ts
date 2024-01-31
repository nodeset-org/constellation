const { ethers } = require("hardhat");
const fs = require("fs");

// Load the compiled artifact JSON
const artifact = JSON.parse(fs.readFileSync("../artifact/contracts/ValidatorAccount.sol/ValidatorAccount.json", "utf8"));

// Extract the bytecode
const bytecode = artifact.bytecode;

// Compute the initCodeHash
const initCodeHash = ethers.utils.keccak256(bytecode);

console.log("Init Code Hash:", initCodeHash);