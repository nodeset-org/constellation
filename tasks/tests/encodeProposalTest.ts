// testEncodeProposal.ts

import { ethers, run } from "hardhat";

interface TestCase {
    description: string;
    sigs: string[];
    params: any[][];
}

async function main() {
    const testCases: TestCase[] = [
        // Test Case 1
        {
            description: "Test Case 1: transfer and approve",
            sigs: ["transfer(address,uint256)", "approve(address,uint256)"],
            params: [
                ["0xea24abff2d781d3c2dac394c46686b5e43497b6a", "100"],
                ["0xea24abff2d781d3c2dac394c46686b5e43497b6a", "200"],
            ],
        },
        // Test Case 2
        {
            description: "Test Case 2: mint and burn",
            sigs: ["mint(address,uint256)", "burn(uint256)"],
            params: [
                ["0xea24abff2d781d3c2dac394c46686b5e43497b6a", "500"],
                ["300"],
            ],
        },
        // Test Case 3
        {
            description: "Test Case 3: setApprovalForAll",
            sigs: ["setApprovalForAll(address,bool)"],
            params: [["0xea24abff2d781d3c2dac394c46686b5e43497b6a", true]],
        },
        // Test Case 4
        {
            description: "Test Case 4: updatePrice(uint256)",
            sigs: ["updatePrice(uint256)"],
            params: [["1000"]],
        },
        // Test Case 5
        {
            description: "Test Case 5: complex function with multiple types",
            sigs: ["complexFunction(address,uint256,bytes32)"],
            params: [
                [
                    "0xea24abff2d781d3c2dac394c46686b5e43497b6a", // address
                    "123456", // uint256
                    "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcd", // bytes32 (64 hex chars)
                ],
            ],
        },
        // Test Case 6
        {
            description: "Test Case 6: batchTransfer(address[],uint256[])",
            sigs: ["batchTransfer(address[],uint256[])"],
            params: [
                [
                    ["0x1111111111111111111111111111111111111111", "0x2222222222222222222222222222222222222222"], // address[]
                    ["100", "200"], // uint256[]
                ],
            ],
        },
        // Test Case 7
        {
            description: "Test Case 7: updateSettings(uint8,bool,string)",
            sigs: ["updateSettings(uint8,bool,string)"],
            params: [["42", true, "New setting value"]],
        },
        // Test Case 8
        {
            description: "Test Case 8: withdraw(address,uint256,bytes)",
            sigs: ["withdraw(address,uint256,bytes)"],
            params: [
                [
                    "0x3333333333333333333333333333333333333333", // address
                    "1000", // uint256
                    "0xabcdef", // bytes
                ],
            ],
        },
        // Test Case 9
        {
            description: "Test Case 9: setRoleAdmin(bytes32,bytes32)",
            sigs: ["setRoleAdmin(bytes32,bytes32)"],
            params: [
                [
                    "0x" + "00".repeat(32), // bytes32 (role)
                    "0x" + "ff".repeat(32), // bytes32 (admin role)
                ],
            ],
        },
        // Test Case 10
        {
            description: "Test Case 10: emitEvent(string,uint256)",
            sigs: ["emitEvent(string,uint256)"],
            params: [["TestEvent", "12345"]],
        },
        // Test Case 11
        {
            description: "Test Case 11: fallback() payable",
            sigs: ["fallback()"],
            params: [[]],
        },
        // Test Case 12
        {
            description: "Test Case 12: receive() external payable",
            sigs: ["receive()"],
            params: [[]],
        },
        // Test Case 13
        {
            description: "Test Case 13: approveAndCall(address,uint256,bytes)",
            sigs: ["approveAndCall(address,uint256,bytes)"],
            params: [
                [
                    "0x4444444444444444444444444444444444444444", // address
                    "500", // uint256
                    "0x1234567890abcdef", // bytes
                ],
            ],
        },
        // Test Case 14
        {
            description: "Test Case 14: setConfig(tuple)",
            sigs: ["setConfig((uint256,bool,address[]))"],
            params: [
                [
                    [
                        "1000", // uint256
                        false, // bool
                        ["0x5555555555555555555555555555555555555555", "0x6666666666666666666666666666666666666666"], // address[]
                    ],
                ],
            ],
        },
        // Test Case 15
        {
            description: "Test Case 15: multiSigFunction(address,uint256,bytes32[])",
            sigs: ["multiSigFunction(address,uint256,bytes32[])"],
            params: [
                [
                    "0x7777777777777777777777777777777777777777", // address
                    "9999", // uint256
                    [
                        "0x" + "aa".repeat(32), // bytes32
                        "0x" + "bb".repeat(32), // bytes32
                    ],
                ],
            ],
        },
        // Test Case 16: Stress Test
        {
            description: "Test Case 16: Stress test with many functions and parameters",
            sigs: [
                "functionA(uint256)",
                "functionB(address,string)",
                "functionC(bytes32,uint8,bool)",
                "functionD(address[],uint256[])",
                "functionE(bytes)",
                "functionF(uint256[5])",
                "functionG((uint256,bool,address[]))", 
            ],
            params: [
                ["1234567890"], // functionA(uint256)
                ["0x8888888888888888888888888888888888888888", "Stress Test String"], // functionB(address,string)
                [
                    "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcd", // bytes32
                    "255", // uint8
                    false, // bool
                ], // functionC(bytes32,uint8,bool)
                [
                    ["0x9999999999999999999999999999999999999999", "0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"], // address[]
                    ["1000", "2000"], // uint256[]
                ], // functionD(address[],uint256[])
                ["0xdeadbeefdeadbeef"], // functionE(bytes)
                [["1", "2", "3", "4", "5"]], // functionF(uint256[5])
                [
                    [
                        "42", // uint256 in tuple
                        true, // bool in tuple
                        ["0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB"], // address[] in tuple
                    ],
                ], // functionG((uint256,bool,address[]))
            ],
        },

    ];

    const stressTest = testCases[testCases.length - 1]; 

    for (let i = 0; i < 5; i++) {
        // Modify the function names slightly to avoid duplicates
        stressTest.sigs.push(`functionA${i}(uint256)`);
        stressTest.params.push([`${1234567890 + i}`]);

        stressTest.sigs.push(`functionB${i}(address,string)`);
        stressTest.params.push([
            `0x${(BigInt("0x8888888888888888888888888888888888888888") + BigInt(i))
                .toString(16)
                .padStart(40, "0")}`,
            `Stress Test String ${i}`,
        ]);

        stressTest.sigs.push(`functionK${i}(bytes32[])`);
        stressTest.params.push([
            [
                "0x" + "aa".repeat(32),
                "0x" + "bb".repeat(32),
                "0x" + "cc".repeat(32),
            ],
        ]);

        stressTest.sigs.push(`functionL${i}(uint256,bool,bytes)`);
        stressTest.params.push([
            `${1000 + i}`, // uint256
            i % 2 === 0, // bool
            "0x" + "dd".repeat(10 + i), // bytes
        ]);
    }

    for (const testCase of testCases) {
        console.log(`\nRunning ${testCase.description}`);
        console.log(`Function Signatures: ${JSON.stringify(testCase.sigs, null, 2)}`);
        console.log(`Parameters: ${JSON.stringify(testCase.params, null, 2)}`);

        try {
            // Prepare the parameters as JSON strings
            const sigsJson = JSON.stringify(testCase.sigs);
            const paramsJson = JSON.stringify(testCase.params);

            // Run the encodeProposal task programmatically
            await run("encodeProposal", { sigs: sigsJson, params: paramsJson });
        } catch (error: any) {
            console.error(`Error in ${testCase.description}:`, error.message || error);
        }
    }
}

main()
    .then(() => {
        console.log("\nAll test cases completed.");
    })
    .catch((error) => {
        console.error("An error occurred during testing:", error);
    });
