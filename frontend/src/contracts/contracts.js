import { web3 } from "../web3";

const address = "0x6359B43BE93f5739a3b9ff4C85d298A60AD64d1D";
const ABI = [
    {
        constant: true,
        inputs: [],
        name: "serviceSeller",
        outputs: [{ name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function"
    },
    {
        constant: false,
        inputs: [],
        name: "transferFunds",
        outputs: [],
        payable: true,
        stateMutability: "payable",
        type: "function"
    },
    {
        constant: false,
        inputs: [],
        name: "payDeposit",
        outputs: [],
        payable: true,
        stateMutability: "payable",
        type: "function"
    },
    {
        constant: true,
        inputs: [],
        name: "currentJob",
        outputs: [
            { name: "jobName", type: "string" },
            { name: "jobDetails", type: "string" },
            { name: "gweiRequired", type: "uint256" },
            { name: "etherPaid", type: "bool" },
            { name: "sellerStatus", type: "bool" },
            { name: "buyerStatus", type: "bool" }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
    },
    {
        constant: false,
        inputs: [
            { name: "jobName", type: "string" },
            { name: "jobDetails", type: "string" },
            { name: "gweiRequired", type: "uint256" }
        ],
        name: "createJob",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        constant: false,
        inputs: [],
        name: "markJobAsComplete",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        constant: true,
        inputs: [],
        name: "serviceBuyer",
        outputs: [{ name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "constructor"
    }
];

export const localContract = new web3.eth.Contract(ABI, address);
