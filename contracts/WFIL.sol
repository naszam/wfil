/// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.6.10;

///@title WFIL
///@author Nazzareno Massari @naszam
///@notice Wrapped Filecoin
///@dev All function calls are currently implemented without side effects through TDD approach
///@dev OpenZeppelin library is used for secure contract development

import "@openzeppelin/contracts/presets/ERC20PresetMinterPauser.sol";


contract WFIL is ERC20PresetMinterPauser {

  constructor()
  ERC20PresetMinterPauser("Wrapped FIL", "WFIL")
  public {

  }

}
