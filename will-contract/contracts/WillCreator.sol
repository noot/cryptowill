import './Libraries/SafeMath.sol';

pragma solidity 0.4.24;

/* WILL CREATION SMART CONTRACT */ 
contract WillCreator {
    using SafeMath for uint256;
    
    address owner;
    
    constructor() public {
        owner = msg.sender;
    }
    
    // for testing
    //event ReleasedEth(address _child, address _parent, bool willExists);
    
    struct will{
        uint value;
        uint timeToDeath;
        uint timeLastCheckedIn;
        address child;
        bool isValid;
    }
    
    mapping (address => will) public myWill;
    mapping (address => bool) public doesWillExist;
    mapping (address => address) public parent;
    
    // fallback: return eth to msg.sender
    function () public payable {
        revert();
    }
    
    // input: address the eth will be sent to after owner of will dies
    // uint time that the user wishes to be considered dead after no interaction
    function makeWill(address _child, uint _time) public payable {
        require ( !doesWillExist[msg.sender] || !myWill[msg.sender].isValid );
        doesWillExist[msg.sender] = true;
        myWill[msg.sender].value = msg.value;
        myWill[msg.sender].timeToDeath = _time;
        myWill[msg.sender].timeLastCheckedIn = block.timestamp;
        myWill[msg.sender].child = _child;
        myWill[msg.sender].isValid = true;
        
        doesWillExist[msg.sender] = true;
        parent[_child] = msg.sender;
    }
    
    
    modifier myWillExists() {
        require(doesWillExist[msg.sender]);
        _;
    }
    
    function checkin() public myWillExists() {
        myWill[msg.sender].timeLastCheckedIn = block.timestamp;
    }
    
    function timeToDeath(address _a) public view returns (uint) {
        require(doesWillExist[_a]);
        return myWill[_a].timeLastCheckedIn + myWill[_a].timeToDeath - block.timestamp;
    }
    
    // if child of a parent who has died calls this function, send total eth in the will to them
    // if the current time is past the time of last check-in plus the user-set time until death
    // child must know the address of the parent
    function releaseEth() public returns (bool) {
        //emit ReleasedEth(msg.sender, parent[msg.sender], doesWillExist[parent[msg.sender]]);
        require(doesWillExist[parent[msg.sender]] == true);
        require(myWill[parent[msg.sender]].timeLastCheckedIn + myWill[parent[msg.sender]].timeToDeath <= block.timestamp);
        
        uint val = myWill[parent[msg.sender]].value;
        myWill[parent[msg.sender]].value = 0;
        myWill[parent[msg.sender]].isValid = false;
        parent[msg.sender] = address(0);
        msg.sender.transfer(val);
        return true;
    }
    
    function getParent() public view returns (address) {
        return parent[msg.sender];
    }
    
    function isWillValid(address _a) public view returns (bool) {
        return myWill[_a].isValid;
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
    
    function getTimeLastCheckedIn(address _a) public view returns (uint) {
        return myWill[_a].timeLastCheckedIn;
    }
    
    // allows parent to change the child
    // child can now be assigned to another will
    function changeChild(address _newChild) public myWillExists() returns (bool) {
        require(parent[_newChild] == address(0));
        parent[myWill[msg.sender].child] = address(0);
        myWill[msg.sender].child = _newChild;
        parent[_newChild] = msg.sender;
        return true;
    }
    
    function changeTimePeriod(uint _time) public myWillExists() returns (bool) {
        myWill[msg.sender].timeToDeath = _time;
        return true;
    }
    
    // withdraw eth back to original sending account
    function withdraw(uint _val) public myWillExists() returns (bool) {
        return transfer(msg.sender, _val);
    }
    
    // withdraw all eth back to original sending account
    function withdrawAll() public myWillExists() returns (bool) {
        uint val = myWill[msg.sender].value;
        myWill[msg.sender].value = 0;
        msg.sender.transfer(val);
        return true;
    }
    
    // add msg.value to the will value
    function addToWill() public payable myWillExists() returns (bool) {
        myWill[msg.sender].value = myWill[msg.sender].value.add(msg.value);
        return true;
    }
    
    // transfer eth from contract to owner-specified address
    function transfer(address _to, uint _amount) public myWillExists() returns (bool) {
        require (myWill[msg.sender].value >= _amount);
        myWill[msg.sender].value = myWill[msg.sender].value.sub(_amount);
        _to.transfer(_amount);
        return true;
    }
    
    // deletes will if it exists
    // returns all eth to creating account
    // child can now be attached to another will
    function killWill() public myWillExists() returns (bool) {
        doesWillExist[msg.sender] = false;
        myWill[msg.sender].isValid = false;
        return withdrawAll();
    }
    
    function getRequiredCheckins() constant returns (address[]) {
        
    }
}
