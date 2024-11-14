// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract MockRPLVault {
    uint256 public missingLiquidityValue;
    uint256 public totalAssetsValue;
    uint256 public minWethRplRatio;

    receive() payable external {}

    function getMissingLiquidity() public view returns (uint256) {
        return missingLiquidityValue;
    }

    function setMissingLiquidity(uint256 _missingLiquidity) public {
        missingLiquidityValue = _missingLiquidity;
    }

    function getTreasuryPortion(uint256 _rplReward) public pure returns (uint256) {
        return _rplReward;
    }

    function totalAssets() public view returns (uint256) {
        return totalAssetsValue;
    }

    function setTotalAssets(uint256 _totalAssets) public {
        totalAssetsValue = _totalAssets;
    }

    function setMinWethRplRatio(uint256 _minWethRplRatio) public {
        minWethRplRatio = _minWethRplRatio;
    }
}