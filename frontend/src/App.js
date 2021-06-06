import "./app.css";
import { web3 } from "./web3";
import { localContract } from "./contracts/contracts";
import { useEffect, useState } from "react";
import { NewJobForm } from "./components/new-job-form";
import {Navbar} from "./components/navbar"

function App() {
    const [accounts, setAccounts] = useState([]);
    window.ethereum.on("accountsChanged", (accounts) => {
        setAccounts(accounts);
    });

    const [currentJob, setCurrentJob] = useState({});
    const [seller, setSeller] = useState("");
    useEffect(() => {
        getCurrentJob();
        getAccounts();
        getContractManager();
    }, []);

    let getCurrentJob = async () => {
        const currentJob = await localContract.methods.currentJob().call();
        let foundJob = {
            buyerStatus: currentJob.buyerStatus,
            etherPaid: currentJob.etherPaid,
            gweiRequired: currentJob.gweiRequired,
            jobDetails: currentJob.jobDetails,
            jobName: currentJob.jobName,
            sellerStatus: currentJob.sellerStatus
        };
        setCurrentJob(foundJob);
    };

    let getAccounts = async () => {
        const foundAccounts = await web3.eth.getAccounts();
        setAccounts(foundAccounts);
    };

    let getContractManager = async () => {
        try {
            const foundSeller = await localContract.methods
                .serviceSeller()
                .call();
            setSeller(foundSeller);
        } catch (e) {
            console.log(e);
        }
    };

    const payDeposit = async (e) => {
        e.preventDefault();
        try {
            let value = parseInt(currentJob.gweiRequired) + 1;
            await localContract.methods.payDeposit().send({
                from: accounts[0],
                gas: "100000",
                value: value.toString()
            });
        } catch (e) {
            console.log(e);
        }
    };

    const markJobAsComplete = async (e) => {
        try {
            console.log("calling");
            await localContract.methods
                .markJobAsComplete()
                .send({
                    from: accounts[0],
                    gas: "3000000"
                });
        } catch (e) {
            console.log(e);
        }
    };

    const transferFunds = async (e) => {
        try {
            console.log("calling");
            await localContract.methods
                .transferFunds()
                .send({
                    from: accounts[0],
                    gas: "3000000"
                });
        } catch (e) {
            console.log(e);
            // setLoading(false);
        }
    };

    return (
        <div className="App">
            <Navbar />
            asdadsdas
            <h1>new app</h1>
            Contract Owner: {seller}
            {!currentJob.jobName && (
                <div>
                    There is no current job
                    <NewJobForm account={accounts[0]} />
                </div>
            )}
            if not contract Owner
            {seller !== accounts[0] && (
                <button onClick={payDeposit}>
                    {" "}
                    pay deposit {currentJob.gweiRequired} gwei
                </button>
            )}
            {seller === accounts[0] && (
                <div>
                    <button onClick={markJobAsComplete}> mark complete</button>
                </div>
            )}
            {seller !== accounts[0] && (
                <div>
                    <button onClick={transferFunds}>transferfyds</button>
                </div>
            )}
            <div>Current Job : {currentJob.jobName}</div>
            <div>Job description : {currentJob.jobDetails}</div>
            <div>gweiRequired : {currentJob.gweiRequired}</div>
            <div>depositPaid : {currentJob.etherPaid ? "true " : "false"}</div>
            <div>
                jobComplete : {currentJob.sellerStatus ? "true " : "false"}
            </div>
            <div>
                deposit cleared : {currentJob.buyerStatus ? "true " : "false"}
            </div>
            Current account :{" "}
            {accounts.map((account, index) => {
                return <div key={index}>{account}</div>;
            })}
        </div>
    );
}

export default App;
