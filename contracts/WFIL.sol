/// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.7.3;

/// @title WFIL
/// @author Nazzareno Massari @naszam
/// @notice Wrapped Filecoin
/// @dev All function calls are currently implemented without side effects through TDD approach
/// @dev OpenZeppelin library is used for secure contract development

/*
██     ██ ███████ ██ ██ 
██     ██ ██      ██ ██ 
██  █  ██ █████   ██ ██ 
██ ███ ██ ██      ██ ██ 
 ███ ███  ██      ██ ███████ 
*/

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Pausable.sol";

contract WFIL is AccessControl, ERC20, ERC20Pausable {

    /// @dev Libraries
    using SafeMath for uint;

    /// @dev Roles
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant FEE_SETTER_ROLE = keccak256("FEE_SETTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    /// @dev Data
    uint private _fee;
    address private _feeTo;

    /// @dev Events
    event Wrapped(address to, uint wrapOut, uint wrapFee);
    event Unwrapped(string filaddress, uint unwrapOut, uint unwrapFee);
    event NewFee(uint fee);
    event NewFeeTo(address feeTo);

    constructor(address feeTo_, uint fee_)
        ERC20("Wrapped Filecoin", "WFIL")
    {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);

        _setupRole(MINTER_ROLE, msg.sender);
        _setupRole(PAUSER_ROLE, msg.sender);
        _setupRole(FEE_SETTER_ROLE, msg.sender);

        _setFee(fee_);
        _setFeeTo(feeTo_);
    }

    /// @notice Fallback function
    /// @dev Added not payable to revert transactions not matching any other function which send value
    fallback() external {
        revert();
    }

    /// @notice Getter function for the wrap/unwrap fee
    /// @return _fee current fee
    function fee() external view returns (uint) {
        return _fee;
    }

    /// @notice Set a new fee
    /// @dev Access restricted only for Fee Setters
    /// @dev Call internal function _setFee()
    /// @param wfilFee fee to set
    /// @return True if wfilFee is successfully set
    function setFee(uint wfilFee) external returns (bool) {
        require(hasRole(FEE_SETTER_ROLE, msg.sender), "WFIL/invalid-fee-setter");
        _setFee(wfilFee);
        return true;
    }

    /// @notice Set a new feeTo address
    /// @dev Access restricted only for Fee Setters
    /// @dev Call internal function _setFeeTo()
    /// @param feeTo address to set
    /// @return True if feeTo is successfully set
    function setFeeTo(address feeTo) external returns (bool) {
        require(hasRole(FEE_SETTER_ROLE, msg.sender), "WFIL/invalid-fee-setter");
        _setFeeTo(feeTo);
        return true;
    }

    /// @notice Wrap WFIL, mint amount (wrapFee + wrapOut)
    /// @dev Access restricted only for Minters
    /// @param to Address of the recipient
    /// @param amount Amount of WFIL issued
    /// @return True if WFIL is successfully wrapped
    function wrap(address to, uint amount) external returns (bool) {
        require(hasRole(MINTER_ROLE, msg.sender), "WFIL/invalid-minter");
        uint wrapFee = amount.mul(_fee).div(1000);
        uint wrapOut = amount.sub(wrapFee);
        _mint(_feeTo, wrapFee);
        _mint(to, wrapOut);
        emit Wrapped(to, wrapOut, wrapFee);
        return true;
    }

    /// @notice Unwrap WFIL, transfer unwrapFee + burn uwnrapOut
    /// @dev Emit an event with the Filecoin Address to UI
    /// @param filaddress The Filecoin Address to uwrap WFIL
    /// @param amount The amount of WFIL to unwrap
    /// @return True if WFIL is successfully unwrapped
    function unwrap(string calldata filaddress, uint amount) external returns (bool) {
        uint unwrapFee = amount.mul(_fee).div(1000);
        uint unwrapOut = amount.sub(unwrapFee);
        _transfer(msg.sender, _feeTo, unwrapFee);
        _burn(msg.sender, unwrapOut);
        emit Unwrapped(filaddress, unwrapOut, unwrapFee);
        return true;
    }

    /// @notice Pause all the functions
    /// @dev the caller must have the 'PAUSER_ROLE'
    function pause() external {
        require(hasRole(PAUSER_ROLE, msg.sender), "WFIL/invalid-pauser");
        _pause();
    }

    /// @notice Unpause all the functions
    /// @dev the caller must have the 'PAUSER_ROLE'
    function unpause() external {
        require(hasRole(PAUSER_ROLE, msg.sender), "WFIL/invalid-pauser");
        _unpause();
    }

    /// @notice Prevent transfer to the token contract
    /// @dev Override ERC20 _transfer()
    /// @param sender Sender address
    /// @param recipient Recipient address
    /// @param amount Token amount
    function _transfer(address sender, address recipient, uint amount) internal override {
         require(recipient != address(this), "WFIL/invalid-address-this");
         super._transfer(sender, recipient, amount);
    }

    /// @notice Hook to pause _mint(), _transfer() and _burn()
    /// @dev Override ERC20 and ERC20Pausable Hooks
    /// @param from Sender address
    /// @param to Recipient address
    /// @param amount Token amount
    function _beforeTokenTransfer(address from, address to, uint amount) internal override(ERC20, ERC20Pausable) {
        super._beforeTokenTransfer(from, to, amount);
    }

    /// @notice Internal function to set fee
    /// @dev set function visibility to private
    /// @param wfilFee fee to set
    function _setFee(uint wfilFee) private {
        _fee = wfilFee;
        emit NewFee(wfilFee);
    }

    /// @notice Internal function to set feeTo address
    /// @dev set function visibility to private
    /// @param feeTo address to set
    function _setFeeTo(address feeTo) private {
        require(feeTo != address(0), "WFIL/invalid-address-0");
        require(feeTo != address(this), "WFIL/invalid-address-this");
        _feeTo = feeTo;
        emit NewFeeTo(feeTo);
    }
}
