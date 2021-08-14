const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))

const { interface, bytecode } = require("../compile.js");

let lottery;
let accounts;

let CONTRACT_MANAGER;
let CLIENT;

const WEI_REQUIRED = 1000000
const AMOUNT_LESS = 900000
beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    CONTRACT_MANAGER = accounts[0];
    CLIENT = accounts[1];
    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode })
        .send({ from: accounts[0], gas: "1000000" });

    await lottery.methods
        .createJob("First job", "Fix the bathroom", WEI_REQUIRED)
        .send({
            from: CONTRACT_MANAGER
        });
});

describe("Solidbox contract", () => {
    it("Should deploy a contract", () => {
        assert.ok(lottery.options.address);
    });

    it("should allow the contract manager to create a Job ", async () => {
        let currentJob = await lottery.methods.currentJob().call({
            from: CONTRACT_MANAGER
        });
        assert.equal(currentJob.jobName, "First job");
    });

    it("should allow the user to pay for a job", async () => {
        await lottery.methods.payDeposit().send({
            from: CLIENT,
            gas: "100000",
            value: WEI_REQUIRED.toString()
        });
        let updatedJob = await lottery.methods.currentJob().call({
            from: CONTRACT_MANAGER
        });
        assert.equal(updatedJob.etherPaid, true);
    });

    it("should throw an error if the user sends less than the required amount", async () => {
        let call = async () => {
            await lottery.methods.payDeposit().send({
                from: CLIENT,
                gas: "100000",
                value: AMOUNT_LESS.toString()
            })
        }
        await expect(call())
            .to.be.rejectedWith("VM Exception while processing transaction: revert Please send the correct amount of ether")
        let updatedJob = await lottery.methods.currentJob().call({
            from: CONTRACT_MANAGER
        });
        assert.equal(updatedJob.etherPaid, false);
    });

    it("should allow contract manager to set job complete to true", async () => {
        let call = async () => {
            await lottery.methods.markJobAsComplete().send({
                from: CONTRACT_MANAGER,
                gas: "100000",
            })
        }

        await expect(call())
            .to.be.fulfilled

        let updatedJob = await lottery.methods.currentJob().call({
            from: CONTRACT_MANAGER
        });
        assert.equal(updatedJob.sellerStatus, true);
    });

    it("should not allow anyone other than contract manager to set job complete to true", async () => {
        let call = async () => {
            await lottery.methods.markJobAsComplete().send({
                from: CLIENT,
                gas: "100000",
            })
        }

        await expect(call())
            .to.be.rejectedWith("VM Exception while processing transaction: revert Not authorised to make this function call")

        let updatedJob = await lottery.methods.currentJob().call({
            from: CONTRACT_MANAGER
        });
        assert.equal(updatedJob.sellerStatus, false);
    });

    it("should allow buyer to release funds", async () => {
        await lottery.methods.payDeposit().send({
            from: CLIENT,
            gas: "100000",
            value: WEI_REQUIRED.toString()
        })

        let call = async () => {
            await lottery.methods.transferFunds().send({
                from: CLIENT,
                gas: "100000",
            })
        }

        const CONTACT_MANAGER_BALANCE = await web3.eth.getBalance(CONTRACT_MANAGER)
        await expect(call())
            .to.be.fulfilled

        const CONTACT_MANAGER_BALANCE_AFTER = await web3.eth.getBalance(CONTRACT_MANAGER)
        let updatedJob = await lottery.methods.currentJob().call({
            from: CLIENT
        });

        assert.equal(updatedJob.jobName, "");
        assert.equal(CONTACT_MANAGER_BALANCE_AFTER, parseInt(CONTACT_MANAGER_BALANCE) + WEI_REQUIRED);
    });

    it("should not allow anyone other than buyer to release funds", async () => {
        await lottery.methods.payDeposit().send({
            from: CLIENT,
            gas: "100000",
            value: WEI_REQUIRED.toString()
        })

        let call = async () => {
            await lottery.methods.transferFunds().send({
                from: CONTRACT_MANAGER,
                gas: "100000",
            })
        }

        await expect(call())
            .to.be.rejectedWith("VM Exception while processing transaction: revert Not authorised to make this function call")
    });
});
