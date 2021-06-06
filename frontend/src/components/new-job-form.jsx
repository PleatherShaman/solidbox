import React, { useState } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { localContract } from '../contracts/contracts'

const newJobSchema = Yup.object().shape({
  jobName: Yup.string()
    .min(2, 'Please enter a job name longer than 2 characters')
    .max(50, 'Too Long!')
    .required('Required'),
  jobDetails: Yup.string()
    .min(2, 'Please enter a job description longer than 2 characters')
    .required('Required'),
  gweiRequired: Yup.number()
    .min(1, 'Please enter a value larger than 0')
    .required('This field is requried'),
})

export const NewJobForm = (props) => {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values) => {
    console.log(props.account)

    // console.log(parseInt(values.gweiRequired));

    setLoading(true)

    try {
      let updatedContract = await localContract.methods
        .createJob(values.jobName, values.jobDetails, values.gweiRequired)
        .send({
          from: props.account,
          gas: '1000000',
        })
      setLoading(false)

      // blockNumber
      //

      console.log(updatedContract)
    } catch (e) {
      console.log(e)
      setLoading(false)
    }
  }

  return (
    <>
      {loading && <h1>Loading</h1>}

      <div>
        <h1>Signup</h1>
        <Formik
          initialValues={{
            jobName: '',
            jobDetails: '',
            gweiRequired: '',
          }}
          validationSchema={newJobSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <div>
                <div>Job Name:</div>
                <div>
                  <Field name="jobName" />
                  {errors.jobName && touched.jobName ? (
                    <div>{errors.jobName}</div>
                  ) : null}
                </div>
              </div>

              <div>
                <div>Job Description:</div>
                <Field name="jobDetails" />
                {errors.jobDetails && touched.jobDetails ? (
                  <div>{errors.jobDetails}</div>
                ) : null}
              </div>
              <div>
                <div>gwei Required:</div>
                <div>
                  <Field name="gweiRequired" type="gweiRequired" />
                  {errors.gweiRequired && touched.gweiRequired ? (
                    <div>{errors.gweiRequired}</div>
                  ) : null}
                </div>
              </div>

              <button type="submit">Submit</button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  )
}
