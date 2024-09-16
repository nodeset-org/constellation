// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract MockRPLVault {
    uint256 missingLiquidityValue;

    function getMissingLiquidity() public view returns (uint256) {
        return missingLiquidityValue;
    }

    function setMissingLiquidity(uint256 _missingLiquidity) public {
        missingLiquidityValue = _missingLiquidity;
    }
}