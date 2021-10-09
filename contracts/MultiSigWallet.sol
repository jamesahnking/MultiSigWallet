// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

contract MultiSigWallet {
    address[] public approvers;
    uint public quorum;
    
    // Transfer struct
    // Called by one of the approver addressese to suggest a transfer of tokens
    struct Transfer {
        uint id;
        uint amount;
        address payable to;
        uint approvals;
        bool sent;
    }
    
    // mapping transfer to go along with each transaction
    Transfer[] public transfers;
    
    // Transfer approval mapping
    mapping(address => mapping(uint => bool)) public approvals;
    
    
    // Instantiate at start - list of approvers 
    // Amount that will be needed for quorum
    constructor(address[] memory _approvers, uint _quorum)  {
        approvers = _approvers;
        quorum = _quorum;
    }
    
    // return the list of addressess that can approve trandactions
    function getApprovers() external view returns(address[] memory) {
        return approvers;
    }
    
    // return list of 
    function getTransfers() external view returns(Transfer[] memory) {
        return transfers;
    }
    
    // generate trandfer when called by apporving address
    function createTransfer(uint amount, address payable to) external onlyApprover(){
        transfers.push(Transfer(
            transfers.length,
            amount,
            to,
            0,
            false
        ));
    }
    
    // Approve each transfer
    function approveTransfer(uint id) external onlyApprover() {
        // require checks for any double spend or call
        require(transfers[id].sent == false, 'Transfer has already been sent');
        require(approvals[msg.sender][id] == false, 'cannot approve transfer twice');
        
        approvals[msg.sender][id] = true; // change id = true
        transfers[id].approvals++; // increment number of approvals
        
        
        // if the transfer approval is equal or more than needed
        if(transfers[id].approvals >= quorum) {
            transfers[id].sent = true; // mark that transfer is sent
            address payable to = transfers[id].to; // send payment to address given
            uint amount = transfers[id].amount; // send amount provided
            to.transfer(amount); // transfer - 'tranfer' is a Solidity function
            
            
        }
    }
    
    // Allow contract to receive funds 
    // Solidity key word function 
    receive() external payable  {}
    
    
    // Access Control Modifier to attach to create and approve transfer functions
    modifier onlyApprover() {
        bool allowed = false;
        for(uint i = 0; i < approvers.length; i++) {
            if(approvers[i] == msg.sender) {
                allowed = true;
            }
        }
        require(allowed == true, 'only approver allowed');
        _;
    }
    
}