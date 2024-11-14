// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract MockWETHVault {
    uint256 treasuryFeeValue;
    uint256 nodeOperatorFeeValue;
    uint256 missingLiquidityValue;
    uint256 totalAssetsValue;

    receive() payable external {}

    function treasuryFee() public view returns (uint256) {
        return treasuryFeeValue;
    }

    function setTreasuryFee(uint256 _treasuryFee) public {
        treasuryFeeValue = _treasuryFee;
    }

    function nodeOperatorFee() public view returns (uint256) {
        return nodeOperatorFeeValue;
    }

    function setNodeOperatorFee(uint256 _nodeOperatorFee) public {
        nodeOperatorFeeValue = _nodeOperatorFee;
    }

    function getMissingLiquidity() public view returns (uint256) {
        return missingLiquidityValue;
    }

    function setMissingLiquidity(uint256 _missingLiquidity) public {
        missingLiquidityValue = _missingLiquidity;
    }

    function getTreasuryPortion(uint256 ethReward) public pure returns (uint256) {
        return ethReward / 2;
    }

    function getOperatorPortion(uint256 ethReward) public pure returns (uint256) {
        return ethReward / 2;
    }

    function totalAssets() public view returns (uint256) {
        return totalAssetsValue;
    }

    function setTotalAssets(uint256 _totalAssets) public {
        totalAssetsValue = _totalAssets;
    }
}