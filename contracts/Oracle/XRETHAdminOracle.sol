// SPDX License Identifier: GPL v3

import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';

import '../Interfaces/Oracles/IXRETHOracle.sol';
import '../UpgradeableBase.sol';
import '../Operator/SuperNodeAccount.sol';

pragma solidity 0.8.17;

struct MerkleProofParams {
    address nodeAddress;
    uint256[] rewardIndex;
    uint256[] amountRPL;
    uint256[] amountETH;
    bytes32[][] merkleProof;
}

contract XRETHAdminOracle is IXRETHOracle, UpgradeableBase {

    event TotalYieldAccruedUpdated(uint256 _amount);

    uint256 internal _totalYieldAccrued;
    uint256 internal _lastUpdatedTotalYieldAccrued;

    constructor() initializer {}

    /// @dev Initializes the FundRouter contract with the specified directory address.
    /// @param _directoryAddress The address of the directory contract.
    function initializeAdminOracle(address _directoryAddress) public virtual initializer {
        super.initialize(_directoryAddress);
    }

    function getTotalYieldAccrued() external view override returns (uint) {
        return _totalYieldAccrued;
    }

    function _setTotalYieldAccrued(bytes calldata _sig, uint256 _newTotalYieldAccrued, uint256 _sigTimeStamp) internal {
        address recoveredAddress = ECDSA.recover(
            ECDSA.toEthSignedMessageHash(
                keccak256(abi.encodePacked(_newTotalYieldAccrued, _sigTimeStamp, address(this), block.chainid))
            ),
            _sig
        );
        require(
            _directory.hasRole(Constants.ADMIN_ORACLE_ROLE, recoveredAddress),
            'signer must have permission from admin oracle role'
        );
        require(_sigTimeStamp > _lastUpdatedTotalYieldAccrued, 'cannot update tya using old data');
        _totalYieldAccrued = _newTotalYieldAccrued;
        _lastUpdatedTotalYieldAccrued = block.timestamp;
        emit TotalYieldAccruedUpdated(_newTotalYieldAccrued);
    }

    function setTotalYieldAccrued(
        bytes calldata _sig,
        uint256 _newTotalYieldAccrued,
        uint256 _sigTimeStamp
    ) external onlyAdmin {
        _setTotalYieldAccrued(_sig, _newTotalYieldAccrued, _sigTimeStamp);
    }

    function setTotalYieldAccruedAndClaim(
        MerkleProofParams calldata _merkleProofParams,
        bytes calldata _sig,
        uint256 _newTotalYieldAccrued,
        uint256 _sigTimeStamp
    ) external onlyAdmin {
        _setTotalYieldAccrued(_sig, _newTotalYieldAccrued, _sigTimeStamp);
        SuperNodeAccount(_directory.getSuperNodeAddress()).merkleClaim(
            _merkleProofParams.nodeAddress,
            _merkleProofParams.rewardIndex,
            _merkleProofParams.amountRPL,
            _merkleProofParams.amountETH,
            _merkleProofParams.merkleProof
        );
    }
}
