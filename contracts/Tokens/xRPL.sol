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
contract NodeSetRPL is
    Base,
    Ownable,
    ERC20Burnable,
    ERC20Permit,
    ERC20FlashMint
{
    string constant NAME = "RPL in the Sky with Diamonds";
    string constant SYMBOL = "xRPL";
    string constant BURN_TOO_SMALL_ERROR =
        "xRPL: burn amount must be greater than 0";
    string constant MINT_NOT_PERMITTED_ERROR =
        "xRPL: only the YieldDistributor can mint without sending RPL";

    uint private _minimumStakeAmount = 0.1 ether; // rpl in this case

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

        // send RPL to DP
        bool success = RocketTokenRPLInterface(
            getDirectory().RPL_CONTRACT_ADDRESS()
        ).transferFrom(to, getDirectory().getDepositPoolAddress(), amount);
        require(success, "xRPL: Failed to transfer RPL to Deposit Pool!");

        // notify DP that it has received RPL
        DepositPool(getDirectory().getDepositPoolAddress()).receiveRpl(amount);

        _mint(to, amount);
    }

    function mintYield(address to, uint amount) public onlyYieldDistributor {
        _mint(to, amount);
    }

    /***********
     * BURN
     */

    function _burn(address account, uint256 amount) internal override {
        super._burn(account, amount);
        DepositPool(getDirectory().getDepositPoolAddress()).sendRpl(
            payable(account),
            amount
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
        return totalSupply() / tvlRpl;
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