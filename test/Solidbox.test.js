const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const { interface, bytecode } = require("../compile.js");

console.log(interface);
let lottery;
let accounts;

let CONTRACT_MANAGER;
let CLIENT;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    CONTRACT_MANAGER = accounts[0];
    CLIENT = accounts[1];
    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode })
        .send({ from: accounts[0], gas: "1000000" });
});

describe("Solidbox contract", () => {
    it("Should deploy a contract", () => {
        assert.ok(lottery.options.address);
    });

    it("should allow the contract manager to create a Job ", async () => {
        await lottery.methods
            .createJob("First job", "Fix the bathroom", 1000000)
            .send({
                from: accounts[0]
            });

        let currentJob = await lottery.methods.currentJob().call({
            from: accounts[0]
        });
        assert.equal(currentJob.jobName, "First job");
    });
});
