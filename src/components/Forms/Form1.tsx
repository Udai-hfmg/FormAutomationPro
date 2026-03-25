import React, { useState } from 'react'
import HeaderImage from '../UI/HeaderImage'
import FormContainer from '../UI/FormContainer'
import type { PatientDataProps } from '../Input/PatientData'

function HeaderTitles() {
    return <>

        <div className="font-bold">Women's Health Group</div>
        <div>30 Hatfield Lane, Suite 105</div>
        <div>Goshen, NY 10924</div>
        <div>845-291-7400 x 2</div>
    </>
}


const Form1 = ({setPatientData}:PatientDataProps) => {
const [email,setEmail]=useState('')

    const getDetails=async()=>{
        try{
            if(email.trim()!=''){
            const response=await fetch(`https://localhost:7057/api/Patient/${email}`)
            const data=await response.json()
            // console.log(data)
            setPatientData(data)
            }
        }
        catch(e){
            console.error("Error fetching patient data:", e);
        }
    }
    return (
        <FormContainer>
            <HeaderImage headerContent={<HeaderTitles />} />
            <div className=" bg-white text-black p-8 text-sm leading-6 font-sans text-wrap">
                <div className="mb-6">
                    Dr. Aro | NP Mariv D’Agnese | NP Elizabeth Jahn | PA Jennifer Lucia
                </div>

                <div className="mb-4">
                    We have updated our communication system with our patients.
                </div>

                <div className="mb-4">
                    In order to communicate with you faster, we now have a web portal.
                </div>

                <div className="mb-4">
                    You can send us a direct message and we will reply via messenger.
                </div>

                <div className="mb-4">
                    You can view your test results via web portal. If you have not heard back
                    from our office regarding test results, then please give us a call to
                    inquire.
                </div>

                <div className="mb-4">
                    Please kindly provide your email and sign up for the patient web portal.
                    Our front desk will give you access or update your access.
                </div>

                <div className="mt-16 flex items-center">
                    <span className="mr-3">EMAIL ADDRESS:</span>
                    <input type="email" className="flex-1 border-b border-black outline-none" 
                    placeholder="your.email@example.com" 
                    value={email}
                     onChange={(e) => setEmail(e.target.value)}
                        onBlur={getDetails}
                      />
                </div>
            </div>
        </FormContainer>
    )
}

export default Form1