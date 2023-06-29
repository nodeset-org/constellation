// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20FlashMint.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "../Base.sol";
import "../DepositPool.sol";
import "../Interfaces/RocketTokenRPLInterface.sol";

/// @custom:security-contact info@nodeoperator.org
/// @notice LSD tracking the network's yield
contract xRPL is
    Base,
    Ownable,
    ERC20Burnable,
    ERC20Permit,
    ERC20FlashMint
{
    string constant NAME = "Constellation RPL";
    string constant SYMBOL = "xRPL";
    string constant BURN_TOO_SMALL_ERROR =
        "xRPL: burn amount must be greater than 0";
    string constant MINT_NOT_PERMITTED_ERROR =
        "xRPL: only the YieldDistributor can mint without sending RPL";

    uint private _minimumStakeAmount = 0.1e18; // rpl in this case
    uint256 private _adminFeeRate = 0.50e18; // 50% of yield goes to admin

    event MinimumStakeAmountUpdated(
        uint oldMinimumAmount,
        uint newMinimumAmount
    );

    /// @notice Queue of depositors who wish to redeem their position
    address payable[] private redemptionQueue;

    constructor(
        address directoryAddress
    ) Base(directoryAddress) ERC20(NAME, SYMBOL) ERC20Permit(NAME) {}

    /***********
     * MINTING
     */

    /// @notice Exchanges the senders' RPL for this token instead.
    /// @dev Requires this contract to already have approval from the sender to spend their RPL.
    function mint(address to, uint amount) public {
        require(amount >= _minimumStakeAmount, getMinimumStakeError());

        // Calculate the fee to be paid
        uint256 fee = amount * _adminFeeRate;

        // Ensure the amount after fee is still above the minimum stake amount
        require(amount - fee >= _minimumStakeAmount, "Amount after fee is below the minimum stake amount");

        // Subtract the fee from the amount
        amount -= fee;

        require(RocketTokenRPLInterface(getDirectory().RPL_CONTRACT_ADDRESS()).transferFrom(msg.sender, getDirectory().getAdminAddress(), fee), "Failed to transfer admin fee");

        // send RPL to DP
        bool success = RocketTokenRPLInterface(
            getDirectory().RPL_CONTRACT_ADDRESS()
        ).transferFrom(to, getDirectory().getDepositPoolAddress(), amount);
        require(success, "xRPL: Failed to transfer RPL to Deposit Pool!");


        // notify DP that it has received RPL
        DepositPool(getDirectory().getDepositPoolAddress()).receiveRpl(amount);

        // calculate mint amount
        _mint(to, amount / getRedemptionValuePerToken());
    }

    function mintYield(address to, uint amount) public onlyYieldDistributor {
        _mint(to, amount);
    }

    /***********
     * BURN
     */

    function _burn(address account, uint256 xrpl, uint256 rpl) internal {
        super._burn(account, xrpl);
        DepositPool(getDirectory().getDepositPoolAddress()).sendRpl(
            payable(account),
            rpl
        );
    }

    /***********
     * GETTERS
     */

    function getMinimumStakeAmount() public view returns (uint) {
        return _minimumStakeAmount;
    }

    function getRedemptionValuePerToken() public view returns (uint) {
        uint tvlRpl = DepositPool(getDirectory().getDepositPoolAddress())
            .getTvlRpl();
        assert(tvlRpl > 0);

        if (totalSupply() == 0) return 1;
        return (totalSupply() * 1e18 / tvlRpl) / 1e18;
    }

    function getMinimumStakeError() public view returns (string memory) {
        return
            string.concat(
                string.concat(
                    "Minimum stake is ",
                    Strings.toString(_minimumStakeAmount)
                ),
                " RPL"
            );
    }

    function redeem(uint xrpl) external {
        uint rpl = xrpl * getRedemptionValuePerToken();

        require(rpl > 0, BURN_TOO_SMALL_ERROR);
        require(
            balanceOf(msg.sender) >= rpl,
            "xRPL: You do not have enough xRPL to redeem"
        );

        _burn(msg.sender, xrpl, rpl);
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
            MINT_NOT_PERMITTED_ERROR
        );
        _;
    }
}
