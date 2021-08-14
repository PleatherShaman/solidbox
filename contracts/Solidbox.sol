pragma solidity ^0.4.17;

contract Solidbox {
    address public serviceSeller;
    address public serviceBuyer;
    Job public currentJob;

    struct Job {
        string jobName;
        string jobDetails;
        uint gweiRequired;
        bool etherPaid;
        bool sellerStatus;
        bool buyerStatus;
    }
 
    constructor() public {
        serviceSeller = msg.sender;
    }
    
    function createJob(  
        string jobName,
        string jobDetails,
        uint gweiRequired) public sellerOnly{
            
        Job memory newJob = Job({
            jobName: jobName,
            jobDetails: jobDetails,
            gweiRequired: gweiRequired,
            etherPaid: false,
            sellerStatus: false,
            buyerStatus: false
        });
        
        currentJob = newJob;
    }
    
    function payDeposit() public payable {
       require(msg.value >= currentJob.gweiRequired, "Please send the correct amount of ether");
       serviceBuyer = msg.sender;
       currentJob.etherPaid = true;
    }
    
    function markJobAsComplete() public sellerOnly{
       currentJob.sellerStatus = true;
    }
    

    function transferFunds() public payable buyerOnly{
       currentJob.buyerStatus = true;
       serviceSeller.transfer(address(this).balance);
       
       delete currentJob;
    }

    modifier sellerOnly() {
        require(msg.sender == serviceSeller, "Not authorised to make this function call");
        _;
    }
    
      modifier buyerOnly() {
        require(msg.sender == serviceBuyer, "Not authorised to make this function call");
        _;
    }   
}
