// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20FlashMint.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "../Base.sol";
import "../DepositPool.sol";

/// @custom:security-contact info@nodeoperator.org
/// @notice LSD tracking the network's yield
contract xrETH is
    Base,
    Ownable,
    ERC20Burnable,
    ERC20Permit,
    ERC20FlashMint
{
    string constant NAME = "Constellation ETH";
    string constant SYMBOL = "xrETH";
    string constant BURN_TOO_SMALL_ERROR =
        "xrETH: burn amount must be greater than 0";

    uint private _minimumStakeAmount = 0.1 ether;

    event MinimumStakeAmountUpdated(
        uint oldMinimumAmount,
        uint newMinimumAmount
    );

    constructor(
        address directoryAddress
    ) Base(directoryAddress) ERC20(NAME, SYMBOL) ERC20Permit(NAME) {}

    /***********
     * MINTING
     */

    receive() external payable {
        mint(msg.sender, msg.value);
    }

    function internalMint(address to, uint amount) public onlyYieldDistributor {
        _mint(to, amount / getRedemptionValuePerToken());
    }

    function mint(address to, uint amount) private {
        require(amount >= _minimumStakeAmount, getMinimumStakeError());

        (bool success, ) = getDirectory().getDepositPoolAddress().call{
            value: amount
        }("");
        require(success, "xrETH: Failed to transfer ETH to Deposit Pool!");

        _mint(to, amount / getRedemptionValuePerToken());
    }

    /***********
     * BURN
     */

    function _burn(address account, uint256 xrETH, uint256 eth) internal {
        super._burn(account, xrETH);
        DepositPool(getDirectory().getDepositPoolAddress()).sendEth(
            payable(account),
            eth
        );
    }

    /***********
     * GETTERS
     */

    function getMinimumStakeAmount() public view returns (uint) {
        return _minimumStakeAmount;
    }

    function getRedemptionValuePerToken() public view returns (uint) {
        uint tvlEth = DepositPool(getDirectory().getDepositPoolAddress())
            .getTvlEth();
        assert(tvlEth > 0);

        // TODO: add in tvl from yield oracle

        if (totalSupply() == 0) return 1;
        return totalSupply() / tvlEth;
    }

    function getMinimumStakeError() public view returns (string memory) {
        return
            string.concat(
                string.concat(
                    "Minimum stake is ",
                    Strings.toString(_minimumStakeAmount)
                ),
                " wei"
            );
    }

    /***********
     * REDEEM
     */

    function redeem(uint xrETH) external {
        uint256 eth = xrETH * getRedemptionValuePerToken();
        require(eth > 0, BURN_TOO_SMALL_ERROR);
        require(
            eth <= balanceOf(msg.sender),
            "xrETH: Not enough ETH in contract to redeem!"
        );

        _burn(msg.sender, xrETH, eth);
    }

    /***********
     * ADMIN
     */

    function setMinimumStakeAmount(uint newStakeAmount) external onlyAdmin {
        uint oldMin = _minimumStakeAmount;
        _minimumStakeAmount = newStakeAmount;
        emit MinimumStakeAmountUpdated(oldMin, _minimumStakeAmount);
    }

    modifier onlyYieldDistributor() {
        require(
            msg.sender == getDirectory().getYieldDistributorAddress(),
            "This can only be called by the YieldDistributor!"
        );
        _;
    }
}
