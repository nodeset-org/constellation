// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import '@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol';
import '@openzeppelin/contracts/utils/Address.sol';

import '../Whitelist/Whitelist.sol';
import '../Utils/Errors.sol';

import '../Operator/OperatorDistributor.sol';
import '../Operator/YieldDistributor.sol';
import '../Operator/ValidatorAccount.sol';
import '../Operator/ValidatorAccountFactory.sol';

import '../Tokens/WETHVault.sol';
import '../Tokens/RPLVault.sol';

import '../DepositPool.sol';
import '../AdminTreasury.sol';
import '../PriceFetcher.sol';
import '../Directory.sol';

import '../Interfaces/RocketPool/IRocketStorage.sol';

import 'hardhat/console.sol';

contract Bootstrapper {
    Whitelist public whitelistImplementation;
    ERC1967Proxy public whitelistProxy;

    WETHVault public wethVaultImplementation;
    ERC1967Proxy public wethVaultProxy;

    RPLVault public rplVaultImplementation;
    ERC1967Proxy public rplVaultProxy;

    DepositPool public depositPoolImplementation;
    ERC1967Proxy public depositPoolProxy;

    OperatorDistributor public operatorDistributorImplementation;
    ERC1967Proxy public operatorDistributorProxy;

    YieldDistributor public yieldDistributorImplementation;
    ERC1967Proxy public yieldDistributorProxy;

    PriceFetcher public priceFetcherImplementation;
    ERC1967Proxy public priceFetcherProxy;

    AdminTreasury public adminTreasuryImplementation;
    ERC1967Proxy public adminTreasuryProxy;

    ValidatorAccount public validatorAccountImplementation;

    ValidatorAccountFactory public validatorAccountFactoryImplementation;
    ERC1967Proxy public validatorAccountFactoryProxy;

    Directory public directoryImplementation;
    ERC1967Proxy public directoryProxy;

    function generateBytes32Identifier(string memory contractName) public pure returns (bytes32) {
        return keccak256(abi.encode(string.concat('contract.address', contractName)));
    }

    constructor(
        address _rocketStorage,
        address _weth,
        address _xrethOracle,
        address _uniswapV3Pool,
        address _sanctions,
        address _admin
    ) {
        IRocketStorage rocketStorage = IRocketStorage(_rocketStorage);
        address predictedDirectory = address(2);

        whitelistProxy = new ERC1967Proxy(
            address(whitelistImplementation = new Whitelist()),
            abi.encodeWithSelector(Whitelist.initializeWhitelist.selector, address(predictedDirectory))
        );

        wethVaultProxy = new ERC1967Proxy(
            address(wethVaultImplementation = new WETHVault()),
            abi.encodeWithSelector(WETHVault.initializeVault.selector, address(predictedDirectory), _weth)
        );

        address rplToken = rocketStorage.getAddress(generateBytes32Identifier('rocketStorage'));

        rplVaultProxy = new ERC1967Proxy(
            address(rplVaultImplementation = new RPLVault()),
            abi.encodeWithSelector(RPLVault.initializeVault.selector, address(predictedDirectory), rplToken)
        );

        depositPoolProxy = new ERC1967Proxy(
            address(depositPoolImplementation = new DepositPool()),
            abi.encodeWithSelector(DepositPool.initialize.selector, address(predictedDirectory))
        );
        operatorDistributorProxy = new ERC1967Proxy(
            address(operatorDistributorImplementation = new OperatorDistributor()),
            abi.encodeWithSelector(OperatorDistributor.initialize.selector, address(predictedDirectory))
        );

        yieldDistributorProxy = new ERC1967Proxy(
            address(yieldDistributorImplementation = new YieldDistributor()),
            abi.encodeWithSelector(YieldDistributor.initialize.selector, address(predictedDirectory))
        );

        priceFetcherProxy = new ERC1967Proxy(
            address(priceFetcherImplementation = new PriceFetcher()),
            abi.encodeWithSelector(UpgradeableBase.initialize.selector, address(predictedDirectory))
        );

        adminTreasuryProxy = new ERC1967Proxy(
            address(adminTreasuryImplementation = new AdminTreasury()),
            abi.encodeWithSelector(AdminTreasury.initialize.selector, address(predictedDirectory))
        );

        validatorAccountFactoryProxy = new ERC1967Proxy(
            address(validatorAccountFactoryImplementation = new ValidatorAccountFactory()),
            abi.encodeWithSelector(
                ValidatorAccountFactory.initializeWithImplementation.selector,
                address(predictedDirectory),
                new ValidatorAccount()
            )
        );

        Protocol memory protocol = Protocol({
            whitelist: address(whitelistProxy),
            wethVault: payable(wethVaultProxy),
            rplVault: payable(rplVaultProxy),
            depositPool: payable(depositPoolProxy),
            operatorDistributor: payable(operatorDistributorProxy),
            validatorAccountFactory: address(validatorAccountFactoryProxy),
            yieldDistributor: payable(yieldDistributorProxy),
            oracle: _xrethOracle,
            priceFetcher: address(priceFetcherProxy),
            rocketStorage: _rocketStorage,
            rocketNodeManager: rocketStorage.getAddress(generateBytes32Identifier('rocketNodeManager')),
            rocketNodeStaking: rocketStorage.getAddress(generateBytes32Identifier('rocketNodeStaking')),
            rocketNodeDeposit: rocketStorage.getAddress(generateBytes32Identifier('rocketNodeDeposit')),
            rplToken: address(rplToken),
            weth: payable(_weth),
            uniswapV3Pool: _uniswapV3Pool,
            sanctions: _sanctions
        });

        directoryProxy = new ERC1967Proxy(
            address(directoryImplementation = new Directory()),
            abi.encodeWithSelector(Directory.initialize.selector, protocol, adminTreasuryProxy, _admin)
        );

        console.log('predicted directory');
        console.logAddress(predictedDirectory);
        console.log('actual dir');
    }
}
