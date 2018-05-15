var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "type car bar size remove grunt blood wisdom face speak banana spot world knock bicycle";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
   development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
      //gas: 1000000,
      //gasLimit: 67000000
   },
   ropsten: {
      provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/"),
      network_id: "*",
      gas: 200000,
      gasLimit: 67000000
   },
   mainnet: {
      provider: new HDWalletProvider(mnemonic, "https://mainnet.infura.io/gpcq2PXJhM3TALrZmuhX"),
      network_id: 1,
      gas: 1000000,
      gasLimit: 67000000
   }  
  }
};
