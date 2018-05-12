var WillCreator = artifacts.require("WillCreator");

contract("WillCreator", function(accounts) {
    var addressA = accounts[0];
    var addressB = accounts[1];
    var addressC = accounts[2];
    var addressD = accounts[3];
    web3.eth.defaultAccount = web3.eth.accounts[0]

    let contract;

    it("should create a contract instance", async() => {
    	willContract = await WillCreator.deployed();
    	console.log("\t\t WillCreator contract instance address: " + willContract.address);
    	assert(willContract != undefined, "has no contract instance.");
    });

    it("should create a new will", async() => {
        let _time = 180;
        let _value = 100;
        let makeWillHash = await willContract.makeWill(addressB, _time, {from: addressA, value: _value});
        //console.log("\t\t child: " + await willContract.getChild({from: addressA}));
        assert(await willContract.doesWillExist(addressA), "will of addressA does not exist");
        assert(await willContract.getChild({from: addressA}) == addressB, "child in will was not set correctly");
        assert(await willContract.getValue({from: addressA}) == _value, "value in will was not set correctly");
        assert(await willContract.getTimePeriod({from: addressA}) == _time, "time in will was not set correctly");
        assert(await willContract.isMentioned(addressB), "child did not become mentioned");
    });

    it("should change the child", async() => {
        let changeChildHash = await willContract.changeChild(addressC, {from: addressA});
        assert(await willContract.getChild({from: addressA}) == addressC, "child in will was not set correctly");

    });

})