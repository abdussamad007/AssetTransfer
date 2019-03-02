/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */
require('babel-register');

const HDWalletProvider = require("truffle-hdwallet-provider");
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777" // Match any network id
    },
  ropsten:{
    provider: function() {
      return new HDWalletProvider( MNEMONIC, "https://ropsten.infura.io/v3/<key>"); //Add Mnemonic and Infra key
    },
    network_id:3,
    gas : 6721975,
    gasPrice: 100000000000,
    from: "" //Address of Seller
    }
  },
// Configure your compilers
    compilers: {
        solc: {
           version: "0.4.24",    // Fetch exact version from solc-bin (default: truffle's version)
          // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
          // settings: {          // See the solidity docs for advice about optimization and evmVersion
            optimizer: {
              enabled: false,
              runs: 200
            }//,
          //  evmVersion: "byzantium"
          // }
        }
      }
};
