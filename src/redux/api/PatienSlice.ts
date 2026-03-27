import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import type { FinalFormData } from "../../hooks/useFormData";

const BASR_URL = import.meta.env.VITE_BASE_URL

export const patientApi = createApi({
    reducerPath:"patientApi",
    baseQuery:fetchBaseQuery({baseUrl:BASR_URL}),
    endpoints:(builder)=>({
        getPatientInfo:builder.query({
            query:(patientId)=>`api/Patient/${patientId}`
        }) , 
            postPatientInfo:builder.mutation({
            query:(data:FinalFormData)=>({
                url:"api/Patient",
                method:"POST",
                body:data
            })
    })
})
})

export const {useGetPatientInfoQuery, usePostPatientInfoMutation}  = patientApi