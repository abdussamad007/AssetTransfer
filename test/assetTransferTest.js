const AssetTransfer = artifacts.require("./AssetTransfer.sol");
const assert = require('assert');
const Web3 = require('web3');
//const web3 = new Web3(ganache.provider());
const web3 = new Web3("http://localhost:7545");
const seller = ''; //Add the address used to deploy contract
const buyer = ''; //Add account address;
const inspector = ''; //Add account address;
const appraiser = ''; //Add account address;

describe("AssetTransfer", () => {

  it("Deploy Contract", function(done) {
    AssetTransfer.new("MorcoPolo", 500000, {from: seller}).then(function(result){
      assert.equal(result["tx"]["receipt"]["status"], "0x1", "Deployed Contract");
    }).catch(function(error){
      assert.fail("Error while deploy: "+error);
    });
    done();
  });

  var contractInstance;
  it("it initializes the contract", function(done) {
    AssetTransfer.deployed().then(function(instance) {
      contractInstance = instance;
      done();
      return contractInstance;
    });
  });

  it("MakeOffer Success", function(done){
    if(contractInstance != null){
      contractInstance.MakeOffer(inspector, appraiser, 800000, {from: buyer})
      .then(function(result){  
        console.log('Result: '+result["tx"]["receipt"]["status"]);
      }).catch(function(error){
        console.log('Error: '+error);
      });
      done();
    }
  });

  it("Reject Offer", function(done){
    if(contractInstance != null){
      contractInstance.Reject({from: seller}).then(function(result){
        console.log('Result: '+result["tx"]["receipt"]["status"]);
      }).catch(function(error){
        console.log(error);
      });  
        done();
    }
  });

  it("Modify Offer", function(done){
    if(contractInstance != null){
      contractInstance.ModifyOffer(900000, {from: buyer}).then(function(result){
        console.log('Result: '+result["tx"]["receipt"]["status"]);
      }).catch(function(error){
        console.log(error);
      });  
        done();
    }
  });

  it("Buyer Accept Offer", function(done){
    if(contractInstance != null){
      contractInstance.AcceptOffer({from: buyer}).then(function(result){
        console.log('Result: '+result["tx"]["receipt"]["status"]);
      }).catch(function(error){
        console.log(error);
      });  
        done();
    }
  });

  it("Mark Inspection", function(done){
        if(contractInstance != null){
          contractInstance.MarkInspected({from: inspector}).then(function(result){
            console.log('Result: '+result["tx"]["receipt"]["status"]);
          }).catch(function(error){
            console.log(error);
          });  
            done();
    }
  });

  it("Mark Appraised", function(done){
    if(contractInstance != null){
      contractInstance.MarkAppraised({from: appraiser}).then(function(result){
        console.log('Result: '+result["tx"]["receipt"]["status"]);
      }).catch(function(error){
        console.log(error);
      });  
        done();
    }
  });

  it("Seller Accepted Offer", function(done){
    if(contractInstance != null){
      contractInstance.Accept({from: seller}).then(function(result){
        console.log('Result: '+result["tx"]["receipt"]["status"]);
      }).catch(function(error){
        console.log(error);
      });  
        done();
    }
  });

  it("Buyer Accepted Offer", function(done){
    if(contractInstance != null){
      contractInstance.Accept({from: buyer}).then(function(result){
        console.log('Result: '+result["tx"]["receipt"]["status"]);
      }).catch(function(error){
        console.log(error);
      });  
        done();
    }
  });

});