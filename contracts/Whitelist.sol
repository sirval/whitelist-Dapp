//SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

contract Whitelist {
    //maximum number of addresses which can be whitelisted
    uint8 public maxWhitelistedAddress;

    mapping(address => bool) public whitelistedAddresses;

    //keep track of number of addresses till now
    uint8 public numAddressesWhitelisted;

    constructor(uint8 _maxWhitelistedAddress) {
        maxWhitelistedAddress = _maxWhitelistedAddress;
    }

    function addAddressToWhitelist() public {
        //require the address of the sender
        require(!whitelistedAddresses[msg.sender], "Sender already exists");
        require(
            numAddressesWhitelisted < maxWhitelistedAddress,
            "Max Limit Reached. No additional address needed."
        );
        whitelistedAddresses[msg.sender] = true;
        numAddressesWhitelisted += 1;
    }
}
