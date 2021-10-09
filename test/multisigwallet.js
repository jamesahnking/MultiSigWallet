const { expectRevert } = require('@openzeppelin/test-helpers');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const { assert } = require("console");
// // const { it } = require('ethers/wordlists');
// const { italic } = require("ansi-colors");


const MultiSigWallet = artifacts.require('MultiSigWallet');

// Define Contract Block 

contract('MultiSigWallet', (accounts) => {
    let wallet;
    beforeEach(async () => {
        // Three addresses with a minimum of two for a transfer to be approved.
        wallet = await MultiSigWallet.new([accounts[0], accounts[1], accounts[2]], 2);
        await web3.eth.sendTransaction({from: accounts[0], to: wallet.address, value: 1000});
    });

    it('should have correct approvers and quorum', async () => {
        // store approvers / qorum
        const approvers = await wallet.getApprovers();
        const quorum = await wallet.quorum();

        // check accounts 
        assert(approvers.length === 3);
        assert(approvers[0] === accounts[0]);
        assert(approvers[1] === accounts[1]);
        assert(approvers[2] === accounts[2]);
        assert(quorum.toNumber() === 2);
    });
    // test createTransfer
    it('should transfer an amount of money for an approver', async () => {
        await wallet.createTransfer(100, accounts[5],{from: accounts[0]});
        const transfers = await wallet.getTransfers();
        // there should be one transacation in the transactions array 
        assert(transfers.length === 1); 
        // is the id of the first transaction === 0
        assert(transfers[0].id === '0');
        // is the transfer ammount 1000? 
        assert(transfers[0].amount === '100');
        // is the transfer from account 0 - account 5 actually real?
        assert(transfers[0].to === accounts[5]);
        // is the transfers approval count 0?
        assert(transfers[0].approvals === '0');
        // has the transfer been sent before ?
        assert(transfers[0].sent === false);

    });

    it('should NOT transfer an amount of money for a non-approved ', async () => {
         await expectRevert (
            wallet.createTransfer(100, accounts[5],{from: accounts[4]}),
            'only approver allowed'
       );
    });

    // // approve transfer - happy path 1
    it('should increment appr0vals', async () => {
        await wallet.createTransfer(100, accounts[5], {from: accounts[0]});
        await wallet.approveTransfer(0, {from: accounts[0]});
        // created constants
        const transfers = await wallet.getTransfers();
        const balance = await web3.eth.getBalance(wallet.address);
        // assert constants 
        assert(transfers[0].approvals === '1');
        assert(transfers[0].sent === false);
        assert(balance === '1000');
    });
    
    // // approve transfer - happy path 2
    it('should send transfer if quorum reached', async () => {
        const balanceBefore = web3.utils.toBN(await web3.eth.getBalance(accounts[6]));
        await wallet.createTransfer(100, accounts[6], {from: accounts[0]});
        // two account approvals
        await wallet.approveTransfer(0, {from: accounts[0]});
        await wallet.approveTransfer(0, {from: accounts[1]});
        // check if tbe new balance for account 6 recieved the 100 tokens
        const balanceAfter = web3.utils.toBN(await web3.eth.getBalance(accounts[6]));  
        assert(balanceAfter.sub(balanceBefore).toNumber() === 100);

    });

    // Unhappy Path 
    it('should NOT approve transfer if sender is not approved ', async () => {
        await wallet.createTransfer(100, accounts[5], {from: accounts[0]});
        await expectRevert(
            wallet.approveTransfer(0, {from: accounts[4]}),
            'only approver allowed'
        );
    });

    it('should NOT approve transfer if sender is already sent', async () => {
        await wallet.createTransfer(100, accounts[6], {from: accounts[0]});
        // two account approvals
        await wallet.approveTransfer(0, {from: accounts[0]});
        await wallet.approveTransfer(0, {from: accounts[1]});
        await expectRevert(
            wallet.approveTransfer(0, {from: accounts[2]}),
            'Transfer has already been sent'
        );
    });


    it('should NOT approve transfer twice', async () => {
        await wallet.createTransfer(100, accounts[6], {from: accounts[0]});
        await wallet.approveTransfer(0, {from: accounts[0]});
        await expectRevert(
            wallet.approveTransfer(0, {from: accounts[0]}),
            'cannot approve transfer twice'
        );
    });

});