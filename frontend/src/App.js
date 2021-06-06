import "./App.css";
import { web3 } from "./web3";
import { localContract } from "./contracts/contracts";
import { useEffect, useState } from "react";
import { NewJobForm } from "./components/new-job-form";
import { Navbar } from "./components/navbar";
import { HeroBanner } from "./components/hero-banner";
import { Loader } from "./components/loader";
import { Alert } from "./components/alert";

function App() {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState({ message: "", type: "" });
    window.ethereum &&
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
        try {
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
        } catch (e) {
            console.log(e);
        }
    };

    let getAccounts = async () => {
        try {
            const foundAccounts = await web3.eth.getAccounts();
            setAccounts(foundAccounts);
        } catch (e) {
            console.log(e);
        }
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
        setLoading(true);
        try {
            let value = parseInt(currentJob.gweiRequired) + 100;
            await localContract.methods.payDeposit().send({
                from: accounts[0],
                gas: "100000",
                value: value.toString()
            });

            setLoading(false);
            setAlertMessage({
                message: "successfully paid deposit",
                type: "green"
            });
            setTimeout(() => {
                setAlertMessage({ message: "", type: "" });
            }, 3000);
            getCurrentJob();
        } catch (e) {
            setAlertMessage({
                message: "an error occured with the payment of deposit",
                type: "red"
            });
            setTimeout(() => {
                setAlertMessage({ message: "", type: "" });
            }, 3000);
            setLoading(false);
        }
    };

    const markJobAsComplete = async (e) => {
        setLoading(true);
        try {
            await localContract.methods.markJobAsComplete().send({
                from: accounts[0],
                gas: "3000000"
            });

            setLoading(false);
            setAlertMessage({
                message: "successfully marked job as complete",
                type: "green"
            });
            setTimeout(() => {
                setAlertMessage({ message: "", type: "" });
            }, 3000);
            getCurrentJob();
        } catch (e) {
            setAlertMessage({
                message: "an error occured with marking the job complete",
                type: "red"
            });
            setTimeout(() => {
                setAlertMessage({ message: "", type: "" });
            }, 3000);
            setLoading(false);
        }
    };

    const transferFunds = async (e) => {
        setLoading(true);
        try {
            await localContract.methods.transferFunds().send({
                from: accounts[0],
                gas: "3000000"
            });

            setLoading(false);
            setAlertMessage({
                message: "successfully released funds",
                type: "green"
            });
            setTimeout(() => {
                setAlertMessage({ message: "", type: "" });
            }, 3000);
            getCurrentJob();
        } catch (e) {
            setAlertMessage({
                message: "an error occured with releasing the funds",
                type: "red"
            });
            setTimeout(() => {
                setAlertMessage({ message: "", type: "" });
            }, 3000);
            setLoading(false);
        }
    };

    return (
        <>
            <div className="App">
                <Navbar />
                <HeroBanner />
                <div className={"info-container"}>
                    <h2>What is Solidbox?</h2>
                    <p>
                        Solidbox is a smart contract that holds Etherium
                        whilst business transactions are occuring. Once all
                        parties of the transaction are satsified that the
                        transaction is complete, the funds will get released.
                    </p>

                    <p>
                        Solidbox gives confidence to businesses that their
                        client has the funds available for the transaction. It
                        also protects clients as the funds will only get
                        released once they are satisfied that the job is
                        complete.
                    </p>
                </div>

                <div className={"info-container"}>
                    <h2> How it works? </h2>
                    <p>
                        The business wil create a job, indicating the job name,
                        description and Ether required for the completion of the
                        job.
                    </p>
                    <p>
                        The client then pays the ether into the Solidbox smart
                        contract which will initiate the business to start the
                        job
                    </p>
                    <p>
                        Once the job is completed, the client will release the
                        funds to the business
                    </p>
                </div>

                <div className="solidbox-app">
                    <h1>Solidbox</h1>
                    <div>Contract Owner: {seller}</div>
                    {!currentJob.jobName && (
                        <>
                            There is no job currently on this smart contract
                            {seller === accounts[0] && (
                                <NewJobForm
                                    account={accounts[0]}
                                    getCurrentJob={getCurrentJob}
                                />
                            )}
                        </>
                    )}

                    {currentJob.jobName && (
                        <div className="current-job-container">
                            <h3>There is a active Solidbox</h3>

                            <div>
                                <img
                                    className="treasure"
                                    src="/treasure.png"
                                    alt=""
                                />
                            </div>

                            <div className="job-items">
                                <div className="current-job-item">
                                    <div className="bold item-label">
                                        Current Job:{" "}
                                    </div>
                                    {currentJob.jobName}
                                </div>

                                <div className="current-job-item">
                                    <div className="bold item-label">
                                        Job description:{" "}
                                    </div>
                                    {currentJob.jobDetails}
                                </div>

                                <div className="current-job-item">
                                    <div className="bold item-label">
                                        wei Required:{" "}
                                    </div>
                                    {currentJob.gweiRequired}
                                </div>

                                <div className="current-job-item">
                                    <div className="bold item-label">
                                        Deposit paid?:{" "}
                                    </div>
                                    {currentJob.etherPaid ? "true " : "false"}
                                </div>

                                <div className="current-job-item">
                                    <div className="bold item-label">
                                        Job complete?:{" "}
                                    </div>
                                    {currentJob.sellerStatus
                                        ? "true "
                                        : "false"}
                                </div>

                                <div className="current-job-item">
                                    <div className="bold item-label">
                                        Payment released?:{" "}
                                    </div>
                                    {currentJob.buyerStatus ? "true " : "false"}
                                </div>
                            </div>
                        </div>
                    )}

                    {currentJob.jobName &&
                        seller !== accounts[0] &&
                        !currentJob.etherPaid && (
                            <div className="button-container">
                                <button className="button" onClick={payDeposit}>
                                    Pay deposit
                                </button>
                            </div>
                        )}

                    {currentJob.jobName &&
                        seller === accounts[0] &&
                        currentJob.etherPaid &&
                        !currentJob.sellerStatus && (
                            <div className="button-container">
                                <button
                                    className="button"
                                    onClick={markJobAsComplete}
                                >
                                    Job complete
                                </button>
                            </div>
                        )}

                    {currentJob.jobName &&
                        seller !== accounts[0] &&
                        currentJob.etherPaid &&
                        currentJob.sellerStatus && (
                            <div className="button-container">
                                <button
                                    className="button"
                                    onClick={transferFunds}
                                >
                                    Release funds
                                </button>
                            </div>
                        )}

                    {loading && (
                        <>
                            <Loader />
                            <p>Submitting...</p>
                        </>
                    )}

                    {alertMessage.message && <Alert alert={alertMessage} />}
                </div>
            </div>
        </>
    );
}

export default App;
