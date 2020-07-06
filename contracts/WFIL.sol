/// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.6.10;

///@title WFIL
///@author Nazzareno Massari @naszam
///@notice Wrapped Filecoin
///@dev All function calls are currently implemented without side effects through TDD approach
///@dev OpenZeppelin library is used for secure contract development


import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Pausable.sol";



contract WFIL is Ownable, AccessControl, ERC20Burnable, ERC20Pausable {

  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");


  constructor() public ERC20("Wrapped Filecoin", "WFIL"){
    _setupRole(DEFAULT_ADMIN_ROLE, owner());

    _setupRole(MINTER_ROLE, owner());
    _setupRole(PAUSER_ROLE, owner());

  }

  function mint(address to, uint256 amount) external {
      require(hasRole(MINTER_ROLE, msg.sender), "WFIL: must have minter role to mint");
      _mint(to, amount);
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

  function _beforeTokenTransfer(address from, address to, uint256 amount) internal override(ERC20, ERC20Pausable) {
      super._beforeTokenTransfer(from, to, amount);
  }

}
