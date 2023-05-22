// SPDX License Identifier: GPL v3

pragma solidity 0.8.17;

interface IConstellationMinipoolsOracle {
    function getNodesetBackedMinipools()
        external
        view
        returns (address[] memory);

    function addMiniPool(address miniPool) external;

    function removeMiniPool(address miniPool) external;

    function hasMinipool(address miniPool) external view returns (bool);
}
