import jsonAbi from "../build/contracts/WillCreator.json"

var WillContract = TruffleContract(jsonAbi);

window.App = {

    start: function() {
        WillContract.setProvider(web3.currentProvider);
    },

    selectDuration: function(button) {
  /*      $('#dropdownMenuOptions').on('show.bs.dropdown', function () {
                               // do something…
})
        $('#dropdownMenuOptions').find('button').each(function(){
            $(this).attr('active') = 0
        });*/
    },
    
    addWill: function (form)
    {
        var address = form.defaultFormRegisterAddressEx.value;
        var value = form.defaultFormRegisterEthEx.value;
        var timeOption = form.selectMenu1.value;
        
        console.log('address: ' + address);
        console.log('value: ' +  value);
        
        // these need to match the form options
        var timeToSeconds = [10, 155520000, 933120000, 1866240000];
        
        var seconds = timeToSeconds[timeOption];
        console.log('time: ' +  seconds);
        
        WillContract.deployed().then(function(instance) {
            return instance.makeWill(address, seconds, { value: web3.toWei(value,'ether'), from: web3.eth.coinbase, gas: 2000000, gasPrice: 200000000000 });
        }).then(function(txid){
            console.log('txid: ' + txid);
            
        })
        
        return false;
    },

    getWill: function ()
    {
        WillContract.deployed().then(function(instance) {
            return instance.getWillInfo();
        }).then(function(willInfo){
            console.log('Will Info: ' + willInfo);
            
            document.getElementById("result").innerHTML = "";
            if(willInfo != null)
            {
                document.getElementById("result").innerHTML = web3.fromWei(willInfo[0],'ether') + ' ETH => ' + willInfo[3] + ' checked every ' + (willInfo[1]/86400.0).toFixed(8) + ' days';
            }
        })
    },

    killWill: function ()
    {
        console.log('coinbase ' + web3.eth.coinbase);

        WillContract.deployed().then(function(instance) {
            return instance.killWill({ from: web3.eth.coinbase, gas: 2000000 });
        }).then(function(err) {
            console.log('Kill Will. Error? ' + err);
        })
    },

    releaseEth: function ()
    {
        console.log('coinbase ' + web3.eth.coinbase);

        WillContract.deployed().then(function(instance) {
            return instance.releaseEth({ gas: 2000000 });
        }).then(function(err, txid){
            console.log('ETH released. errors?: ' + err);
            //web3.eth.getTransactionReceipt(txid, function(err, receipt){
            //console.log(receipt);
            //})
        })
    },
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
  }
                        
  App.start();
});


