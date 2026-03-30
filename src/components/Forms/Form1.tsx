// import React, { useState } from 'react'
// import HeaderImage from '../UI/HeaderImage'
// import FormContainer from '../UI/FormContainer'
// import type { PatientDataProps } from '../Input/PatientData'

// function HeaderTitles() {
//     return <>

//         <div className="font-bold">Women's Health Group</div>
//         <div>30 Hatfield Lane, Suite 105</div>
//         <div>Goshen, NY 10924</div>
//         <div>845-291-7400 x 2</div>
//     </>
// }


// const Form1 = ({setPatientData,setFormData}:PatientDataProps) => {
// const [email,setEmail]=useState('')

//       const getDetails = async () => {
//     try {
//       if (email.trim() !== "") {
//         const response = await fetch(`https://localhost:7057/api/Patient/${email}`)
//         const data = await response.json()

//         console.log('original data',data);
        
//         // ✅ store raw backend data
//         setPatientData(data)

//         // ✅ VERY IMPORTANT → fill ALL FORMS DATA
//         setFormData({
//           newPatient: {
//             firstName: data?.patient?.firstName || "",
//             middleInitial: data?.patient?.middleInitial || "",
//             lastName: data?.patient?.lastName || "",
//             addressLine1: data?.patient?.addressLine1 || "",
//             city: data?.patient?.city || "",
//             state: data?.patient?.state || "",
//             zipCode: data?.patient?.zipCode || "",
//             ssN_Last4: data?.patient?.ssN_Last4 || "",
//             dateOfBirth: data?.patient?.dateOfBirth?.split("T")[0] || "",
//             sex: data?.patient?.sex || "",
//             maritalStatus: data?.patient?.maritalStatus || "",
//             phonePrimary: data?.patient?.phonePrimary || "",
//             phoneAlternate: data?.patient?.phoneAlternate || "",

//             contactName: data?.emergency?.contactName || "",
//             contactPhone: data?.emergency?.phone || "",
//             relationship: data?.emergency?.relationship || "",

//             pharmacyName: data?.pharmacy?.pharmacyName || "",
//             pharmacyLocation: data?.pharmacy?.location || "",
//             pharmacyPhone: data?.pharmacy?.phone || "",

//             language: data?.demographics?.language || "",
//             race: data?.demographics?.race || "",
//             ethnicity: data?.demographics?.ethnicity || "",

//             occupation: data?.employer?.occupation || "",
//             employerName: data?.employer?.employerName || "",
//             employerAddress: data?.employer?.employerAddress || "",

//             payerName: data?.insurance?.payerName || "",
//             planName: data?.insurance?.planName || "",

//             emergencyContact:data?.emergency?.contactName || "",
//             emergencyphone:data?.emergency?.phone || "",

//             hipaaFamilyMember:
//               data?.hippa?.length > 0 ? data.hippa[0].familyMemberName : "",
//             hipaaRelationship:
//               data?.hippa?.length > 0 ? data.hippa[0].relationship : "",

//             primaryClinician: "",
//             otherProviders: "",
//             secondaryInsurance: "",
//             selfPay: false,

//             signature: "",
//             signatureDate: ""
//           },

//           hipaa: 
//             data?.hippa || []
// ,

//           hpv: {
//             // map hpv fields if available
//           },

//           insurance: {
//             ...data?.insurance
//           },

//           paymentAgreement: {},

//           paymentPolicy: {},

//           privacy: {}
//         })
//       }
//     } catch (e) {
//       console.error("Error fetching patient data:", e)
//     }}
//     return (
//         <FormContainer>
//             <HeaderImage headerContent={<HeaderTitles />} />
//             <div className=" bg-white text-black p-8 text-sm leading-6 font-sans text-wrap">
//                 <div className="mb-6">
//                     Dr. Aro | NP Mariv D’Agnese | NP Elizabeth Jahn | PA Jennifer Lucia
//                 </div>

//                 <div className="mb-4">
//                     We have updated our communication system with our patients.
//                 </div>

//                 <div className="mb-4">
//                     In order to communicate with you faster, we now have a web portal.
//                 </div>

//                 <div className="mb-4">
//                     You can send us a direct message and we will reply via messenger.
//                 </div>

//                 <div className="mb-4">
//                     You can view your test results via web portal. If you have not heard back
//                     from our office regarding test results, then please give us a call to
//                     inquire.
//                 </div>

//                 <div className="mb-4">
//                     Please kindly provide your email and sign up for the patient web portal.
//                     Our front desk will give you access or update your access.
//                 </div>

//                 <div className="mt-16 flex items-center">
//                     <span className="mr-3">EMAIL ADDRESS:</span>
//                     <input type="email" className="flex-1 border-b border-black outline-none" 
//                     placeholder="your.email@example.com" 
//                     value={email}
//                      onChange={(e) => setEmail(e.target.value)}
//                         onBlur={getDetails}
//                       />
//                 </div>
//             </div>
//         </FormContainer>
//     )
// }

// export default Form1



///new dynamic forms implementation below






import React, { useState } from 'react'
import HeaderImage from '../UI/HeaderImage'
import FormContainer from '../UI/FormContainer'
import type { PatientDataProps } from '../Input/PatientData'
import {useSearchParams} from 'react-router'


function HeaderTitles() {
    return <>

        <div className="font-bold">Women's Health Group</div>
        <div>30 Hatfield Lane, Suite 105</div>
        <div>Goshen, NY 10924</div>
        <div>845-291-7400 x 2</div>
    </>
}
import useFormData from '../../hooks/useFormData'


const Form1 = () => {

const [facility, setFacility] = useState(null)
    
   const {formData , setFormData , handleInput} = useFormData()
 
   
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
                    name="email"
                    placeholder="your.email@example.com" 
                    value={formData?.newPatient?.email || ""}
                     onChange={handleInput}
                        
                      />
                </div>
            </div>
        </FormContainer>
    )
}

export default Form1