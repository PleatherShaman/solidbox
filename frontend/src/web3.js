import Web3 from "web3";

window.ethereum && window.ethereum.request({ method: "eth_requestAccounts" });

export const web3 = new Web3(window.ethereum);
