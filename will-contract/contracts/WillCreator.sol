pragma solidity ^0.4.17;

/* WILL CREATION SMART CONTRACT */
contract WillCreator {
	address myAddress = this;
    
	struct will{
		uint value;
		uint timeToDeath;
		uint timeLastCheckedIn;
		address child;
		bool isValid;
	}
	
	function getBalanceOfContract() public view returns (uint) {
	       return myAddress.balance;
	
}
	mapping (address => will) public myWill;
	mapping (address => bool) public doesWillExist;
	mapping (address => will) public mentionedWill;
	mapping (address => bool) public isMentioned;
	
	// fallback: return eth to msg.sender
	function () public payable {
	    revert();
	}

	// input: address the eth will be sent to after owner of will dies
	// uint time that the user wishes to be considered dead after no interaction
	function makeWill(address c, uint time) public payable {
		require ( (!doesWillExist[msg.sender] || !myWill[msg.sender].isValid ) && !isMentioned[c]);
		doesWillExist[msg.sender] = true;
		myWill[msg.sender].value = msg.value;
		myWill[msg.sender].timeToDeath = time;
		myWill[msg.sender].timeLastCheckedIn = block.timestamp;
		myWill[msg.sender].child = c;
		myWill[msg.sender].isValid = true;

		doesWillExist[msg.sender] = true;
		mentionedWill[c] = myWill[msg.sender];
		isMentioned[c] = true;
	}


	modifier myWillExists() {
		require(doesWillExist[msg.sender]);
		_;
	}

	function checkin() public myWillExists() {
		myWill[msg.sender].timeLastCheckedIn = block.timestamp;			
	}

	function timeToDeath(address a) public view returns (uint) {
		require(doesWillExist[a]);
		return myWill[a].timeLastCheckedIn + myWill[a].timeToDeath - block.timestamp;	
	}

	// if child of a parent who has died calls this function, send total eth in the will to them
	// if the current time is past the time of last check-in plus the user-set time until death 
	function releaseEth() public {
		require (isMentioned[msg.sender] && mentionedWill[msg.sender].timeLastCheckedIn + mentionedWill[msg.sender].timeToDeath < block.timestamp );
		msg.sender.transfer(mentionedWill[msg.sender].value);	
		isMentioned[msg.sender] = false;
		mentionedWill[msg.sender].isValid = false;
	}

	function doesMyWillExist() public view returns (bool) {
		return doesWillExist[msg.sender]; 
	}

	function getChild() public view myWillExists() returns (address) {
		return myWill[msg.sender].child;
	}

	function getValue() public view myWillExists() returns (uint) {
		return myWill[msg.sender].value;
	}

	function getTimePeriod() public view myWillExists() returns (uint) {
		return myWill[msg.sender].timeToDeath;
	}

	function amIChild() public view returns (bool) {
		return isMentioned[msg.sender];
	}

	// allows parent to change the child
	// child can now be assigned to another will
	function changeChild(address _a) public {
		require (isMentioned[msg.sender] || doesWillExist[msg.sender]);
		address _b = myWill[msg.sender].child;
		myWill[msg.sender].child = _a;
		isMentioned[_a] = true;
		isMentioned[_b] = false;
	}

	// withdraw eth back to original sending account
	function withdraw(uint a) public myWillExists() {
		transferEth(msg.sender, a);
	}
	
	// withdraw all eth back to original sending account	
	function withdrawAll() public myWillExists() {
            	msg.sender.transfer(myWill[msg.sender].value);
            	myWill[msg.sender].value = 0;
	}

	// add msg.value to the will value
	function addToWill() public payable myWillExists() {
        	myWill[msg.sender].value = myWill[msg.sender].value + msg.value;
    	}
    
    	// transfer eth from contract to owner-specified address
	function transferEth(address receiver, uint amount) public myWillExists() {
		require (myWill[msg.sender].value >= amount);
		myWill[msg.sender].value = myWill[msg.sender].value - amount;
	   	receiver.transfer(amount);
	}

	// deletes will if it exists
	// returns all eth to creating account
	// child can now be attached to another will
	function killWill() public myWillExists() {
		doesWillExist[msg.sender] = false;
		myWill[msg.sender].isValid = false;
		withdrawAll();
		isMentioned[myWill[msg.sender].child] = false;
	}

	function getWillInfo() public constant returns (uint, uint, uint, address){
	    require (doesWillExist[msg.sender]);
	    will storage senderWill = myWill[msg.sender];
	    return (senderWill.value, senderWill.timeToDeath, senderWill.timeLastCheckedIn, senderWill.child);
	}
}
