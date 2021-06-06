import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { localContract } from "../contracts/contracts";
import { Loader } from "./loader";
import "./form.css";
import { Alert } from "./alert";

const newJobSchema = Yup.object().shape({
    jobName: Yup.string()
        .min(2, "Please enter a job name longer than 2 characters")
        .max(50, "Too Long!")
        .required("Required"),
    jobDetails: Yup.string()
        .min(2, "Please enter a job description longer than 2 characters")
        .required("Required"),
    gweiRequired: Yup.number()
        .min(1, "Please enter a value larger than 0")
        .required("This field is requried")
});

export const NewJobForm = (props) => {
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState({ message: "", type: "" });
    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            await localContract.methods
                .createJob(
                    values.jobName,
                    values.jobDetails,
                    values.gweiRequired
                )
                .send({
                    from: props.account,
                    gas: "1000000"
                });
            setLoading(false);
            setAlertMessage({
                message: "successfully created job",
                type: "green"
            });
            setTimeout(() => {
                setAlertMessage({ message: "", type: "" });
            }, 3000);
            props.getCurrentJob();
        } catch (e) {
            setAlertMessage({
                message: "an error occured with the creation of the contract",
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
            <div className="form-container">
                <div className="form">
                    <h3>Create a new job</h3>
                    <Formik
                        initialValues={{
                            jobName: "",
                            jobDetails: "",
                            gweiRequired: ""
                        }}
                        validationSchema={newJobSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, touched }) => (
                            <Form className="formik-form">
                                <div className="form-item">
                                    <div className="form-label">
                                        <div>Job Name:</div>
                                        {errors.jobName && touched.jobName ? (
                                            <div className="error">
                                                {errors.jobName}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div>
                                        <Field name="jobName" />
                                    </div>
                                </div>

                                <div className="form-item">
                                    <div className="form-label">
                                        <div>Job Details:</div>
                                        {errors.jobDetails &&
                                        touched.jobDetails ? (
                                            <div className="error">
                                                {errors.jobDetails}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div>
                                        <Field name="jobDetails" />
                                    </div>
                                </div>

                                <div className="form-item">
                                    <div className="form-label">
                                        <div>gwei required:</div>
                                        {errors.gweiRequired &&
                                        touched.gweiRequired ? (
                                            <div className="error">
                                                {errors.gweiRequired}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div>
                                        <Field name="gweiRequired" />
                                    </div>
                                </div>
                                <div className="button-container">
                                    <button className="button" type="submit">
                                        Submit
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>

            {loading && (
                <>
                    <Loader />
                    <p>Submitting job...</p>
                </>
            )}

            {alertMessage.message && <Alert alert={alertMessage} />}
        </>
    );
};
