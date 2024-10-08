pragma solidity >0.5.0 <0.9.0;

// SPDX-License-Identifier: GPL-3.0-only

interface IRocketNetworkVoting {

    function initialiseVoting() external;
    
    function setDelegate(address _newDelegate) external;

}