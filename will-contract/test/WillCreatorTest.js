var WillCreator = artifacts.require("WillCreator");
//var Web3 = require('web3');
//var web3 = new Web3(Web3.givenProvider || "ws://localhost:8546");


contract("WillCreator", function(accounts) { 
    var addressA = accounts[0];
    var addressB = accounts[1];
    var addressC = accounts[2];
    var addressD = accounts[3];
    web3.eth.defaultAccount = web3.eth.accounts[0]

    let willContract;

    it("should create a contract instance", async() => {
    	willContract = await WillCreator.deployed();
    	console.log("\t\t WillCreator contract instance address: " + willContract.address);

        let block = web3.eth.getBlock('latest');
        console.log("\t\t gas used to deploy: " + block.gasUsed);
    	assert(willContract != undefined, "has no contract instance.");
    });

    it("should create a new will", async() => {
        let _time = 180;
        let _value = 100;
        let makeWillHash = await willContract.makeWill(addressB, _time, {from: addressA, value: _value});
        let block = web3.eth.getBlock('latest');
        console.log("\t\t gas used to make will: " + block.gasUsed);
        console.log("\t\t time of will creation: " + await willContract.getTimeLastCheckedIn(addressA, {from: addressC}));
        //console.log("\t\t child: " + await willContract.getChild({from: addressA}));
        assert(await willContract.doesWillExist(addressA), "will of addressA does not exist");
        assert(await willContract.getChild({from: addressA}) == addressB, "child in will was not set correctly");
        assert(await willContract.getValue({from: addressA}) == _value, "value in will was not set correctly");
        assert(await willContract.getTimePeriod({from: addressA}) == _time, "time in will was not set correctly");
        //assert(await willContract.isMentioned(addressB), "child did not become mentioned");
    });

    it("should change the child", async() => {
        let changeChildHash = await willContract.changeChild(addressC, {from: addressA});
        assert(await willContract.getChild({from: addressA}) == addressC, "child in will was not set correctly");
        //assert(await willContract.amIChild({from: addressC}), "child was not set");
    });

    it("should have the correct time to death", async() => {
        let timeToDeath = await willContract.timeToDeath(addressA, {from: addressA});
        console.log("\t\t time to death: " + timeToDeath);
        assert(timeToDeath <= 180, "time was not set correctly");
    });

    it("should add ether to will", async() => {
        console.log("\t\t value of will before: " + await willContract.getValue({from: addressA}));
        let addToWillHash = await willContract.addToWill({from: addressA, value: 100});
        console.log("\t\t value of will after: " + await willContract.getValue({from: addressA}))
        assert(await willContract.getValue({from: addressA}) == 200, "ether did not increase");
    });

    it("should be able to withdraw ether", async() => {
        let withdrawHash = await willContract.withdraw(10, {from: addressA});
        let value = await willContract.getValue({from: addressA});
        console.log("\t\t value of contract after withdrawal: " + value);
        assert(value == 190, "ether was not withdrawn");
    });

    it("should be able to transfer ether from the contract to an address", async() => {
        console.log("\t\t balance of addressB before: " + web3.eth.getBalance(addressB));
        let withdrawHash = await willContract.transfer(addressB, 10, {from: addressA});
        let value = await willContract.getValue({from: addressA});
        console.log("\t\t balance of addressB after: " + web3.eth.getBalance(addressB));
        console.log("\t\t value of contract after withdrawal: " + value);
        assert(value == 180, "ether was not withdrawn");
    });

   /* it("should not release eth yet", async() => {
        //let checkInHash = await willContract.checkin({from: addressA});
        console.log("\t\t last check in time: " + await willContract.getTimeLastCheckedIn(addressA, {from: addressC}));
        console.log("\t\t time period to death: " + await willContract.getTimePeriod({from: addressA}));
        console.log("\t\t block.timestamp: " + web3.eth.getBlock("latest").timestamp);
        console.log("\t\t balance of accountA's will: " + await willContract.getValue({from: addressA}));

        let releaseEthHash = await willContract.releaseEth({from: addressC});
        let releaseEthRes = await willContract.releaseEth.call({from: addressC});

        assert(!releaseEthRes, "released eth");
    });*/

    it("should change time period", async() => {
        let changeTimePeriodHash = await willContract.changeTimePeriod(1, {from: addressA});
        let changeTimePeriodRes = await willContract.changeTimePeriod.call(1, {from: addressA});

        assert(await willContract.getTimePeriod({from: addressA}) == 1, "did not change time period");
    });

    it("should get parent", async() => {
        let parentOfC = await willContract.getParent({from: addressC});
        let parentOfB = await willContract.getParent({from: addressB});
        assert(parentOfC == addressA, "incorrect parent");
        assert(parentOfB == 0x0, "incorrect parent");
        assert(await willContract.isWillValid(addressA));
    })

    it("should release eth", async() => {
        var events = willContract.allEvents({fromBlock: 0, toBlock: 'latest'});

        events.watch(function(error, result) {
            console.log(result);
        });

        console.log("\t\t balance of accountC before: " + await web3.eth.getBalance(addressC));
        console.log("\t\t last check in time: " + await willContract.getTimeLastCheckedIn(addressA, {from: addressC}));
        console.log("\t\t time period to death: " + await willContract.getTimePeriod({from: addressA}));
        console.log("\t\t block.timestamp: " + web3.eth.getBlock("pending").timestamp);
        console.log("\t\t balance of accountA's will before: " + await willContract.getValue({from: addressA}));

        let releaseEthRes = await willContract.releaseEth.call({from: addressC});
        let releaseEthHash = await willContract.releaseEth({from: addressC});

        console.log("\t\t balance of accountA's will after: " + await willContract.getValue({from: addressA}));
        console.log("\t\t balance of accountC after: " + await web3.eth.getBalance(addressC));

        assert(releaseEthRes, "released eth");
    });
})