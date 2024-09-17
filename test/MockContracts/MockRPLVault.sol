// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import 'hardhat/console.sol';
contract MockRPLVault {
    uint256 missingLiquidityValue;

    receive() payable external {}

    function getMissingLiquidity() public view returns (uint256) {
        console.log("!!! getMissingLiquidity", missingLiquidityValue);
        return missingLiquidityValue;
    }

    function setMissingLiquidity(uint256 _missingLiquidity) public {
        missingLiquidityValue = _missingLiquidity;
    }
}