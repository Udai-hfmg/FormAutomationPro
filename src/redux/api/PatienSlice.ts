import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import type { FinalFormData } from "../../hooks/useFormData";

const BASR_URL = import.meta.env.VITE_BASE_URL

export const patientApi = createApi({
    reducerPath: "patientApi",
    baseQuery: fetchBaseQuery({ baseUrl: BASR_URL }),
    endpoints: (builder) => ({
        getPatientInfo: builder.query({
            query: (patientId) => `api/Patient/${patientId}`
        }),
        postPatientInfo: builder.mutation({
            query: (data: any) => ({
                url: "api/Patient/submit",
                method: "POST",
                body: data
            })
        }) ,
       uploadSignature: builder.mutation({
  query: ({ patientId, file }: { patientId: number; file: Blob }) => {
    const formData = new FormData();

    formData.append("file", file, "signature.png"); // ✅ file
    formData.append("patientId", patientId.toString()); // ✅ patientId

    return {
      url: `api/Patient/upload-signature`,
      method: "POST",
      body: formData
    };
  }
}),
       getSesionDetails:builder.query({
            query: (sessionId: string) => `api/Admin/get-session/${sessionId}`
        })
    })
})

export const { useGetPatientInfoQuery, usePostPatientInfoMutation, useGetSesionDetailsQuery,useUploadSignatureMutation } = patientApi