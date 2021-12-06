pragma solidity ^0.5.0;

contract LegitHub {

    address public manufacturer;
    uint public itemCount = 0;
    
    

    struct Item {
        uint id;
        uint serialNumber;
        string name;
        string manfacturedDate;
        string soldDate; //in form month/day/year
        address owner;
    }
    mapping(uint => Item) public items;
    //event itemCreated(uint id, uint serialNumber, string name, string soldDate, string manufacturedDate);
    //event itemVerified(uint id, uint serialNumber, string name, string soldDate);
    event itemCreated(uint id, uint serialNumber, string name, string soldDate, string manufacturedDate, address owner);
    

    constructor() public {
        manufacturer = msg.sender;
    }


    function addItem (uint _serialNumber, string memory _name, string memory _manufacturedDate) public returns(uint){
        //only manufacturer can add item 
        require (msg.sender == manufacturer);

        //serial number must be 8 digits
        require(_serialNumber >= 10000000 && _serialNumber <= 99999999);

        if (_serialNumber >= 10000000 && _serialNumber <= 99999999) {
            itemCount++;
            //items[itemCount] = Item(itemCount, _serialNumber, _name, _manufacturedDate, "00/00/0000");
            items[itemCount] = Item(itemCount, _serialNumber, _name, _manufacturedDate, "00/00/0000", manufacturer);

            //emit itemCreated(itemCount, _serialNumber, _name, _manufacturedDate, "00/00/0000");
            emit itemCreated(itemCount, _serialNumber, _name, _manufacturedDate, "00/00/0000", manufacturer);
            return 1;
        }
        else {
            return 0;
        }

        
    }

    function verifyItem (uint _serialNumber) public view returns (bool) {
        bool found = false;
        uint tempSerial;
        for (uint i = 1; i <= itemCount; i++) {
            tempSerial = getSerial(i);
            if(tempSerial == _serialNumber) {
                found = true;
            }
        }
        return found;
    }

    function sellItem(uint _serialNumber, string memory _soldDate, address _newOwner) public returns (bool){
        //require (msg.sender == manufacturer);
        require(itemExists(_serialNumber) == true);

        uint tempIndex = getIndex(_serialNumber);
        if(tempIndex == 0) {
            return false;
        }
        else {
            items[tempIndex].soldDate = _soldDate;
            items[tempIndex].owner = _newOwner;
            return true;
        }
        

    }

    function resellItem(uint _serialNumber, string memory _soldDate, address _newOwner) public returns (bool){
        uint tempInd = getIndex(_serialNumber);
        if(tempInd == 0) {
            return false;
        }
        else {
            items[tempInd].soldDate = _soldDate;
            items[tempInd].owner = _newOwner;
            return true;
        }
        

    }

    function compareSendertoOwner(uint _serialNumber) public view returns (bool) {
        bool isOwner = false;
        uint index = getIndex(_serialNumber);

        if (msg.sender == items[index].owner) {
            isOwner = true;
        }

        else {
            isOwner = false;
        }
        return isOwner;


    }


    function itemExists(uint _serialNumber) public view returns (bool) {
        bool exists = false;
        for(uint i = 1; i <= itemCount; i++) {
            if(items[i].serialNumber == _serialNumber) {
                exists = true;
                break;
            }
        }
        return exists;
    }

    function validSerial(uint _serialNumber) public pure returns (bool) {
        bool valid = false;
        if (_serialNumber >= 10000000 && _serialNumber <= 99999999) {
            valid = true;
        }

        else {
            valid = false;
        }
        return valid;
    }
    
    function getOwner(uint _serialNumber) public view returns(address itemOwner){
        uint index = getIndex(_serialNumber);
        return items[index].owner;

    }
    function getAddress() public view returns(address) {
        return msg.sender;
    }
    function getSerial(uint _itemCount) private view returns (uint) {
        uint tempSerial;
        tempSerial = items[_itemCount].serialNumber;
        return tempSerial;
    }

    function getSoldDate(uint _serialNumber) public view returns (string memory) {
        uint index = getIndex(_serialNumber);
        return items[index].soldDate;
    }
    function getIndex(uint _serialNumber) private view returns (uint) {
        uint tempIndex = 0;

        for(uint i = 1; i <= itemCount; i++) {
            if(items[i].serialNumber == _serialNumber) {
                tempIndex = i;
                break;
            }
        }
        return tempIndex;
    }
}


/*
pragma solidity ^0.5.0;

contract LegitHub {

    address public manufacturer;
	uint public itemCount = 0;
    
    

	struct Item {
		uint id;
		uint serialNumber;
		string name;
        string manfacturedDate;
        string soldDate; //in form month/day/year
        address owner;
	}
    mapping(uint => Item) public items;
	//event itemCreated(uint id, uint serialNumber, string name, string soldDate, string manufacturedDate);
    //event itemVerified(uint id, uint serialNumber, string name, string soldDate);
	event itemCreated(uint id, uint serialNumber, string name, string soldDate, string manufacturedDate, address owner);
    

    constructor() public {
        manufacturer = msg.sender;
    }


	function addItem (uint _serialNumber, string memory _name, string memory _manufacturedDate) public returns(uint){
        //only manufacturer can add item 
        require (msg.sender == manufacturer);

        //serial number must be 8 digits
        require(_serialNumber >= 10000000 && _serialNumber <= 99999999);

        if (_serialNumber >= 10000000 && _serialNumber <= 99999999) {
            itemCount++;
            //items[itemCount] = Item(itemCount, _serialNumber, _name, _manufacturedDate, "00/00/0000");
            items[itemCount] = Item(itemCount, _serialNumber, _name, _manufacturedDate, "00/00/0000", manufacturer);

            //emit itemCreated(itemCount, _serialNumber, _name, _manufacturedDate, "00/00/0000");
            emit itemCreated(itemCount, _serialNumber, _name, _manufacturedDate, "00/00/0000", manufacturer);
            return 1;
        }
        else {
            return 0;
        }

		
	}

    function verifyItem (uint _serialNumber) public view returns (bool) {
        bool found = false;
        uint tempSerial;
        for (uint i = 1; i <= itemCount; i++) {
            tempSerial = getSerial(i);
            if(tempSerial == _serialNumber) {
                found = true;
            }
        }
        return found;
    }

    function sellItem(uint _serialNumber, string memory _soldDate, address _newOwner) public returns (bool){
        require (msg.sender == manufacturer);
        require(itemExists(_serialNumber) == true);

        uint tempIndex = getIndex(_serialNumber);
        if(tempIndex == 0) {
            return false;
        }
        else {
            items[tempIndex].soldDate = _soldDate;
            items[tempIndex].owner = _newOwner;
            return true;
        }
        

    }

    function resellItem(uint _serialNumber, string memory _soldDate, address _newOwner) public returns (bool){
        uint tempInd = getIndex(_serialNumber);
        if(tempInd == 0) {
            return false;
        }
        else {
            items[tempInd].soldDate = _soldDate;
            items[tempInd].owner = _newOwner;
            return true;
        }
        

    }

    function itemExists(uint _serialNumber) private returns (bool) {
        bool exists = false;
        for(uint i = 1; i <= itemCount; i++) {
            if(items[i].serialNumber == _serialNumber) {
                exists = true;
                break;
            }
        }
        return exists;
    }
    
    function getAddress() public view returns(address) {
        return msg.sender;
    }
    function getSerial(uint _itemCount) private view returns (uint) {
        uint tempSerial;
        tempSerial = items[_itemCount].serialNumber;
        return tempSerial;
    }

    function getSoldDate(uint _serialNumber) public view returns (string memory) {
        uint index = getIndex(_serialNumber);
        return items[index].soldDate;
    }
    function getIndex(uint _serialNumber) private view returns (uint) {
        uint tempIndex = 0;

        for(uint i = 1; i <= itemCount; i++) {
            if(items[i].serialNumber == _serialNumber) {
                tempIndex = i;
                break;
            }
        }
        return tempIndex;
    }
}
*/