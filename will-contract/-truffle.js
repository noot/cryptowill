var secrets = require("./secrets.json");
var HDWalletProvider = require("truffle-hdwallet-provider");
//var mnemonic = secrets.mnemonic;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
   development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 3000000,
      gasLimit: 46000000
   },
   ropsten: {
      provider: new HDWalletProvider(secrets.mnemonic, "https://ropsten.infura.io/"),
      network_id: "*",
      gas: 1000000,
      gasLimit: 67000000,
      gasPrice: web3.utils.toWei(20, "gwei") 
   },
   mainnet: {
      provider: new HDWalletProvider(secrets.mnemonic, "https://mainnet.infura.io/gpcq2PXJhM3TALrZmuhX"),
      network_id: 1,
      gas: 1000000,
      gasLimit: 67000000
   }  
  }
};
