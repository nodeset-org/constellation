// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title MockERC20
/// @dev Simple ERC20 Token example, where all tokens are pre-assigned to the creator.
contract MockERC20 is ERC20, Ownable {
    /// @notice Creates `initialSupply` tokens and assigns them to deployer, improving testing flexibility.
    /// @param _name Token name.
    /// @param _symbol Token symbol.
    /// @param _initialSupply Initial supply of tokens in wei.
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _initialSupply
    ) ERC20(_name, _symbol) {
        _mint(msg.sender, _initialSupply);
    }

    /// @notice Function to mint tokens
    /// @param _to The address that will receive the minted tokens.
    /// @param _amount The amount of tokens to mint.
    function mint(address _to, uint256 _amount) public onlyOwner {
        _mint(_to, _amount);
    }

    /// @notice Function to burn tokens
    /// @param _from The address from which tokens will be burned.
    /// @param _amount The amount of tokens to burn.
    function burn(address _from, uint256 _amount) public onlyOwner {
        _burn(_from, _amount);
    }
}
