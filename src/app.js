
$(document).ready(function(){
    var seller_addr = "";
    var buyer_addr = "";
    var inspector_addr = "";
    var appraiser_addr = "";
    var role_sel = "";
    var prod_desc = "";
    var prod_price = "";
    var AssetTransferContract;
    var newAddress;
    var web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    var web3 = new Web3(web3Provider);

    (hideAll = function(){
        $("#login").hide();
        $("#user").hide();
        $("#sellerTop").hide();
        $("#sellerMid").hide();
        $("#sellerBottom").hide();
        $("#buyerTop").hide();
        $("#buyerBottom").hide();
        $("#inspector").hide();
        $("#appraiser").hide();
        $("#loader").hide();
    })();

    $("#login").show();

    $("#loginBtn").click(function(){
        role_sel = $( "#wf_Role option:selected" ).text();
        if(role_sel == "Seller"){
            seller_addr = $("#wf_Address").val();
            $("#accountAddress").html(" Logged as Seller:  "+seller_addr) ;
            $("#sellerTop").show();
        }else if(role_sel == "Buyer"){
            buyer_addr = $("#wf_Address").val();
            $("#accountAddress").html(" Logged as Buyer:  "+buyer_addr) ;
        }else if(role_sel == "Inspector"){
            inspector_addr = $("#wf_Address").val();
            $("#accountAddress").html( " Logged as Inspector:  "+inspector_addr);
        }else if(role_sel == "Appraiser"){
            appraiser_addr = $("#wf_Address").val();
            $("#accountAddress").html(" Logged as Appraiser:  "+appraiser_addr) ;
        }
        $("#login").hide();
        $("#user").show();
        return role_sel;
    });

    $("#sellBtn").click(function(){
        hideAll();
        $("#loader").show();
        prod_desc = $("#wf_ProdDesc").val();
        prod_price = $("#wf_ProdPrice").val();
        $.getJSON("AssetTransfer.json", function(source){
            //var contracts = source["contractsName"];
            var abi = source["abi"];
            var byteCode = source["bytecode"];
            var AssetTransfer = web3.eth.contract(abi); 
                       
            AssetTransfer.new(prod_desc, prod_price, 
                { from: seller_addr, 
                  gas: 6721975, 
                  gasPrice: 100000000000, 
                  data: byteCode
                }, function(error, instance){
                    if(!error && instance.address){
                        newAddress = instance.address;                        
                        return newAddress;
                    }
                });
            AssetTransferContract = web3.eth.contract(abi).at(newAddress);
            alert(AssetTransferContract);
            if(AssetTransferContract != ""){
                alert(role_sel);
                if(role_sel == "Seller"){
                    $("#sellerMid").show();
                    $("#user").show();
                    $("#deployInfo").html(" Deployed  "+prod_desc+"  Successfully") ;
                }else if(role_sel == "Buyer"){
                    $("#buyerTop").show();
                    $("#modOfferBtn").hide('fast');
                    $("#buyerEventInfo").html(prod_desc+"  Available Now <br> Do you wish to ") ;
                }
            }
            return AssetTransferContract;
        });
        $("#loader").hide();
    });
    


    $("#mkOfferBtn").click(function(done){

    });

    $("#acceptOffer").click(function(done){

    });

    $("#rejectOffer").click(function(done){

    });

    $("#modOfferBtn").click(function(done){

    });

    $("#inspectedBtn").click(function(done){

    });

    $("#appraiseBtn").click(function(done){

    });

    $("#terminate").click(function(done){

    });

    $("#reject").click(function(done){

    });
    
});

