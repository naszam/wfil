/// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.7.1;

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


import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Pausable.sol";



contract WFIL is Ownable, AccessControl, ERC20, ERC20Pausable {

    /// @dev Roles
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    /// @dev Events
    event Wrapped(address to, uint amount);
    event Unwrapped(string filaddress, uint amount);

    constructor()
        ERC20("Wrapped Filecoin", "WFIL")
    {
        _setupRole(DEFAULT_ADMIN_ROLE, owner());

        _setupRole(MINTER_ROLE, owner());
        _setupRole(PAUSER_ROLE, owner());
    }

    /// @notice Fallback function
    /// @dev Added not payable to revert transactions not matching any other function which send value
    fallback() external {
        revert();
    }

    /// @dev Modifiers
    modifier onlyAdmin() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Caller is not an admin");
       _;
    }

    modifier onlyMinter() {
        require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
        _;
    }

    /// @notice Mint new WFIL
    /// @dev Access restricted only for Minters
    /// @param to Address of the recipient
    /// @param amount Amount of WFIL issued
    /// @return True if WFIL is successfully wrapped
    function wrap(address to, uint amount) external onlyMinter returns (bool) {
        _mint(to, amount);
        emit Wrapped(to, amount);
        return true;
    }

    /// @notice Burn WFIL
    /// @dev Emit an event with the Filecoin Address and amount to UI
    /// @param filaddress The Filecoin Address to uwrap WFIL
    /// @param amount The amount of WFIL to unwrap
    /// @return True if WFIL is successfully unwrapped
    function unwrap(string calldata filaddress, uint amount) external returns (bool) {
        _burn(msg.sender, amount);
        emit Unwrapped(filaddress, amount);
        return true;
    }

    /// @notice Add a new Minter
    /// @dev Access restricted only for Admins
    /// @param account Address of the new Minter
    /// @return True if the account address is added as Minter
    function addMinter(address account) external onlyAdmin returns (bool) {
        require(!hasRole(MINTER_ROLE, account), "Account is already a minter");
        grantRole(MINTER_ROLE, account);
        return true;
    }

    /// @notice Remove a Minter
    /// @dev Access restricted only for Admins
    /// @param account Address of the Minter
    /// @return True if the account address is removed as Minter
    function removeMinter(address account) external onlyAdmin returns (bool) {
        require(hasRole(MINTER_ROLE, account), "Account is not a minter");
        revokeRole(MINTER_ROLE, account);
        return true;
    }

    /// @notice Pause all the functions
    /// @dev the caller must have the 'PAUSER_ROLE'
    function pause() external {
        require(hasRole(PAUSER_ROLE, msg.sender), "WFIL: must have pauser role to pause");
        _pause();
    }

    /// @notice Unpause all the functions
    /// @dev the caller must have the 'PAUSER_ROLE'
    function unpause() external {
        require(hasRole(PAUSER_ROLE, msg.sender), "WFIL: must have pauser role to unpause");
        _unpause();
    }

    /// @notice Prevent transfer to the token contract
    /// @dev Override ERC20 _transfer()
    /// @param sender Sender address
    /// @param recipient Recipient address
    /// @param amount Token amount
    function _transfer(address sender, address recipient, uint amount) internal override {
         require(recipient != address(this), "WFIL: transfer to the token contract");
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

}
