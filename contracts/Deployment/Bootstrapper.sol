// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import '@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol';
import '@openzeppelin/contracts/utils/Address.sol';

import '../Whitelist/Whitelist.sol';
import '../Utils/Errors.sol';

import '../Tokens/WETHVault.sol';
import '../Tokens/RPLVault.sol';

import "../Interfaces/RocketPool/IRocketStorage.sol";

import 'hardhat/console.sol';

contract Bootstrapper {
    Whitelist public whitelistImplementation;
    ERC1967Proxy public whitelistProxy;

    WETHVault public wethVaultImplementation;
    ERC1967Proxy public wethVaultProxy;

    RPLVault public rplVaultImplementation;
    ERC1967Proxy public rplVaultProxy;

    function generateBytes32Identifier(string memory contractName) public pure returns(bytes32) {
        return keccak256(abi.encode(string.concat("contract.address", contractName)));
    }

    constructor(address _rocketStorage, address _weth, address _xrethOracle) {

        IRocketStorage rocketStorage = IRocketStorage(_rocketStorage);
        address predictedDirectory = address(2);

        whitelistImplementation = new Whitelist();
        whitelistProxy = new ERC1967Proxy(
            address(whitelistImplementation),
            abi.encodeWithSelector(Whitelist.initializeWhitelist.selector, address(predictedDirectory))
        );

        wethVaultImplementation = new WETHVault();
        wethVaultProxy = new ERC1967Proxy(
            address(wethVaultImplementation),
            abi.encodeWithSelector(WETHVault.initializeVault.selector, address(predictedDirectory), _weth)
        );

        address rplToken = rocketStorage.getAddress(generateBytes32Identifier("rocketStorage"));

        rplVaultImplementation = new RPLVault();
        rplVaultProxy = new ERC1967Proxy(
            address(rplVaultImplementation),
            abi.encodeWithSelector(RPLVault.initializeVault.selector, address(predictedDirectory), rplToken)
        );

        console.log('predicted directory');
        console.logAddress(predictedDirectory);
        console.log('actual dir');
    }
}
