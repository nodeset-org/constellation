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

library RocketpoolEncoder {
    error BadDirectory(address correctDirectory);

    function generateBytes32Identifier(string memory contractName) internal pure returns (bytes32) {
        return keccak256(abi.encode(string.concat('contract.address', contractName)));
    }
}

contract Bootstrapper1 {
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

    Bootstrapper2 public bootstrapper2;

    function step1(
        address _rocketStorage,
        address _weth,
        address _xrethOracle,
        address _uniswapV3Pool,
        address _sanctions,
        address _admin,
        address _predictedAddress
    ) external {
        IRocketStorage rocketStorage = IRocketStorage(_rocketStorage);

        whitelistProxy = new ERC1967Proxy(
            address(whitelistImplementation = new Whitelist()),
            abi.encodeWithSelector(Whitelist.initializeWhitelist.selector, _predictedAddress)
        );

        wethVaultProxy = new ERC1967Proxy(
            address(wethVaultImplementation = new WETHVault()),
            abi.encodeWithSelector(WETHVault.initializeVault.selector, _predictedAddress, _weth)
        );

        address rplToken = rocketStorage.getAddress(RocketpoolEncoder.generateBytes32Identifier('rocketStorage'));

        rplVaultProxy = new ERC1967Proxy(
            address(rplVaultImplementation = new RPLVault()),
            abi.encodeWithSelector(RPLVault.initializeVault.selector, _predictedAddress, rplToken)
        );

        depositPoolProxy = new ERC1967Proxy(
            address(depositPoolImplementation = new DepositPool()),
            abi.encodeWithSelector(DepositPool.initialize.selector, _predictedAddress)
        );
        operatorDistributorProxy = new ERC1967Proxy(
            address(operatorDistributorImplementation = new OperatorDistributor()),
            abi.encodeWithSelector(OperatorDistributor.initialize.selector, _predictedAddress)
        );

        (bootstrapper2 = new Bootstrapper2()).step2(
            this,
            _rocketStorage,
            _weth,
            _xrethOracle,
            _uniswapV3Pool,
            _sanctions,
            _admin,
            _predictedAddress
        );
    }
}

contract Bootstrapper2 {
    YieldDistributor public yieldDistributorImplementation;
    ERC1967Proxy public yieldDistributorProxy;

    PriceFetcher public priceFetcherImplementation;
    ERC1967Proxy public priceFetcherProxy;

    AdminTreasury public adminTreasuryImplementation;
    ERC1967Proxy public adminTreasuryProxy;

    Bootstrapper3 public bootstrapper3;
    Bootstrapper1 public bootstrapper1;

    function step2(
        Bootstrapper1 _bootstrapper1,
        address _rocketStorage,
        address _weth,
        address _xrethOracle,
        address _uniswapV3Pool,
        address _sanctions,
        address _admin,
        address _predictedAddress
    ) external {
        bootstrapper1 = _bootstrapper1;
        
        yieldDistributorProxy = new ERC1967Proxy(
            address(yieldDistributorImplementation = new YieldDistributor()),
            abi.encodeWithSelector(YieldDistributor.initialize.selector, _predictedAddress)
        );

        priceFetcherProxy = new ERC1967Proxy(
            address(priceFetcherImplementation = new PriceFetcher()),
            abi.encodeWithSelector(UpgradeableBase.initialize.selector, _predictedAddress)
        );

        adminTreasuryProxy = new ERC1967Proxy(
            address(adminTreasuryImplementation = new AdminTreasury()),
            abi.encodeWithSelector(AdminTreasury.initialize.selector, _predictedAddress)
        );

        (bootstrapper3 = new Bootstrapper3()).step3(
            this,
            _rocketStorage,
            _weth,
            _xrethOracle,
            _uniswapV3Pool,
            _sanctions,
            _admin,
            _predictedAddress
        );
    }
}

contract Bootstrapper3 {
    ValidatorAccount public validatorAccountImplementation;

    ValidatorAccountFactory public validatorAccountFactoryImplementation;
    ERC1967Proxy public validatorAccountFactoryProxy;

    Directory public directoryImplementation;
    ERC1967Proxy public directoryProxy;

    function step3(
        Bootstrapper2 bootstrapper2,
        address _rocketStorage,
        address _weth,
        address _xrethOracle,
        address _uniswapV3Pool,
        address _sanctions,
        address _admin,
        address _predictedAddress
    ) external {
        IRocketStorage rocketStorage = IRocketStorage(_rocketStorage);
        address rplToken = rocketStorage.getAddress(RocketpoolEncoder.generateBytes32Identifier('rocketStorage'));

        validatorAccountFactoryProxy = new ERC1967Proxy(
            address(validatorAccountFactoryImplementation = new ValidatorAccountFactory()),
            abi.encodeWithSelector(
                ValidatorAccountFactory.initializeWithImplementation.selector,
                _predictedAddress,
                new ValidatorAccount()
            )
        );

        Protocol memory protocol = Protocol({
            whitelist: address(bootstrapper2.bootstrapper1().whitelistProxy()),
            wethVault: payable(bootstrapper2.bootstrapper1().wethVaultProxy()),
            rplVault: payable(bootstrapper2.bootstrapper1().rplVaultProxy()),
            depositPool: payable(bootstrapper2.bootstrapper1().depositPoolProxy()),
            operatorDistributor: payable(bootstrapper2.bootstrapper1().operatorDistributorProxy()),
            validatorAccountFactory: address(validatorAccountFactoryProxy),
            yieldDistributor: payable(bootstrapper2.yieldDistributorProxy()),
            oracle: _xrethOracle,
            priceFetcher: address(bootstrapper2.priceFetcherProxy()),
            rocketStorage: _rocketStorage,
            rocketNodeManager: rocketStorage.getAddress(
                RocketpoolEncoder.generateBytes32Identifier('rocketNodeManager')
            ),
            rocketNodeStaking: rocketStorage.getAddress(
                RocketpoolEncoder.generateBytes32Identifier('rocketNodeStaking')
            ),
            rocketNodeDeposit: rocketStorage.getAddress(
                RocketpoolEncoder.generateBytes32Identifier('rocketNodeDeposit')
            ),
            rplToken: address(rplToken),
            weth: payable(_weth),
            uniswapV3Pool: _uniswapV3Pool,
            sanctions: _sanctions
        });

        directoryProxy = new ERC1967Proxy(
            address(directoryImplementation = new Directory()),
            abi.encodeWithSelector(Directory.initialize.selector, protocol, bootstrapper2.adminTreasuryProxy(), _admin)
        );

        if (address(directoryProxy) != _predictedAddress) {
            revert RocketpoolEncoder.BadDirectory(address(directoryProxy));
        }
    }
}
