// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Booking is Ownable {
    
    /*
    *   Room object for specifics details.
    *   As this is public information, data could be pulled by the public when new Rooms become available.
    */
    struct Room {
        string name;
    }
 
    /*
    *   A reservation is the combination of a room & date & user (address)
    */
    struct Reservation {
        Room room;
        uint256 date;
        address user;
    }
    
    /*
    *   Reservations & Rooms are arrays to be iterable.
    *   Users and Allocations are mappings to save gas.
    */ 
    Reservation[] public reservations;
    Room[] public rooms;
    mapping(address => string) public users;
    mapping(address => uint8) public allocations;
    
    /*
    *   Only the owner of the contract can perform certain functions.
    */
    constructor() {}
    
    /*
    *   Solidity can't return structs externally, so we convert to an array.
    */
    function getRooms() external view returns (string[] memory) {
        string[] memory roomNames = new string[](rooms.length);
        for(uint256 i = 0; i < rooms.length; i++) {
            roomNames[i] = rooms[i].name;
        }
        return roomNames;
    }
    
    /*
    *   Get a room by name, returns found and int position in the rooms array.
    */
    function getRoom(string memory name) public view returns (bool, uint256) {
        bool found = false;
        uint256 r;
        for(uint i = 0; i < rooms.length; i++) {
            if(keccak256(abi.encodePacked(rooms[i].name)) == keccak256(abi.encodePacked(name))) {
                found = true;
                r = i;
                break;
            }
        }
        return (found, r);
    }
    
    /*
    *   Solidity can't return structs externally, so we convert to a tuple of arrays.
    */
    function getReservations() external view returns (string[] memory, uint256[] memory, address[] memory) {
        string[] memory roomNames = new string[](reservations.length);
        uint256[] memory dates = new uint256[](reservations.length);
        address[] memory userAddresses = new address[](reservations.length);
        for(uint i = 0; i < reservations.length; i++) {
            roomNames[i] = reservations[i].room.name;
            dates[i] = reservations[i].date;
            userAddresses[i] = reservations[i].user;
        }
        return (roomNames,dates,userAddresses);
    }
    
    /*
    *   Allow creation of many rooms at once to save time & gas.
    */
    function createRooms(string[] memory names) public onlyOwner {
        require(names.length > 0,"Can't create 0 rooms.");
        
        for(uint i = 0; i < names.length; i++) {
            rooms.push(Room(names[i]));
        }
    }
    
    /*
    *   Assumption: we're not concerned with orphaned reservations as this is a demo project.
    */
    function deleteRoom(string memory name) public onlyOwner {
        for(uint i = 0; i < rooms.length; i++) {
            Room memory r = rooms[i];
            if(keccak256(abi.encodePacked(r.name)) == keccak256(abi.encodePacked(name))) {
                rooms[i] = rooms[rooms.length-1];
                rooms.pop();
                break;
            }
        }
    }
    
    /*
    *   Adjust allocations of max rooms for a user.
    *   Assumption: there aren't overly specific checks as this is a demo project.
    */
    function allocate(address user, uint8 n) public onlyOwner {
        require(bytes(users[user]).length > 0,"User not found.");
        require(n <= rooms.length, "Can't have more allocations than total rooms.");
        allocations[user] = n;
    }
    
    /*
    *   Reserve a room, requiring open availability and the sender to be in the users mapping.
    *   If the tx completes, the reservation was successful.
    *   Approved users or the owner of the contract may call this function.
    *
    *   Assumption: the date is validly formed in 1 hour blocks as this is just a demo.
    */
    function reserve(string memory roomName, uint256 date, address user) public validUser(msg.sender) isAvailable(roomName, date) isBelowAllocation(user, date) {
        (bool found, uint256 index) = getRoom(roomName);
        require(found,"Can't find a room by that name.");
        reservations.push(Reservation(rooms[index],date,user));
    }
    
    /*
    *   Cancel a reservation by removing it from the array.
    *   Only the owner of the contract or the address of that reservation may call this function.
    *
    *   Note: this is also used to delete past reservations.
    */
    function cancel(Room memory room, uint256 date, address user) public validUser(msg.sender) {
        for(uint i = 0; i < reservations.length; i++) {
            Reservation memory r = reservations[i];
            if(keccak256(abi.encodePacked(r.room.name)) == keccak256(abi.encodePacked(room.name)) && r.date == date && r.user == user && msg.sender == user) {
                reservations[i] = reservations[reservations.length-1];
                reservations.pop();
                break;
            }
        }
    }
    
    /*
    *   Give access to a user (address) to create/cancel reservations.
    */
    function giveAccess(address user, string memory name) public onlyOwner {
	allocations[user] = 10;
        users[user] = name;
    }
    
    /*
    *   Remove access to a user (address) to create/cancel reservations.
    */
    function removeAccess(address user) public onlyOwner {
	allocations[user] = 0x0;
        delete users[user];
    }
    
    /*
    *   Loop size affects gas price for users. The owner may call this to remove reservations in the past.
    */
    function clean() public onlyOwner {
        for(uint i = 0; i < reservations.length; i++) {
            if(reservations[i].date < block.timestamp) {
                cancel(reservations[i].room, reservations[i].date, msg.sender);
            }
        }
    }
    
    /*
    *   Users must be approved Or owner
    */
    modifier validUser(address user) {
        require(bytes(users[user]).length > 0 || super.owner() == user,"Not authorized.");
        _;
    }
    
    /*
    *   Is the room available for that date?
    */
    modifier isAvailable(string memory roomName, uint256 date) {
        require(block.timestamp > date, "Can't reserve in the past.");
        bool available = true;
        for(uint i = 0; i < reservations.length; i++) {
            if(keccak256(abi.encodePacked(reservations[i].room.name)) == keccak256(abi.encodePacked(roomName)) && reservations[i].date == date) {
                available = false;
                break;
            }
        }
        require(available,"Room not available for this date.");
        _;
    }
    
    /*
    *   Is the user below the max # of reservations on that date?
    */
    modifier isBelowAllocation(address user, uint256 date) {
        bool r = true;
        uint8 allocation = allocations[user];
        require(allocation != 0x0,"User has 0 allocations.");
        
        uint8 found = 0;
        for(uint i = 0; i < reservations.length; i++) {
            if(reservations[i].date > block.timestamp && reservations[i].user == user) {
                found++;
            }
        }
        
        require(found <= allocation,"User has too many reservations for this date.");
        _;
    }
    
}
