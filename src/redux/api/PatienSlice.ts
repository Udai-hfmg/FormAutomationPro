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
    }),
    uploadSignature: builder.mutation({
      query: ({ patientId, file }: { patientId: number; file: Blob | string }) => {
        const formData = new FormData();

        let finalFile: Blob;

        // ✅ Case 1: already Blob
        if (file instanceof Blob) {
          finalFile = file;
        }
        // ✅ Case 2: base64 string → convert to Blob
        else {
          const byteString = atob(file);
          const byteNumbers = new Array(byteString.length);

          for (let i = 0; i < byteString.length; i++) {
            byteNumbers[i] = byteString.charCodeAt(i);
          }

          finalFile = new Blob([new Uint8Array(byteNumbers)], { type: "image/png" });
        }

        formData.append("file", finalFile, "signature.png");
        formData.append("patientId", patientId.toString());

        return {
          url: `api/Patient/upload-signature`,
          method: "POST",
          body: formData
        };
      }
    }),

    getSesionDetails: builder.query({
      query: (sessionId: string) => `api/Admin/get-session/${sessionId}`
    }),
    getSessionbyOfficeIds:builder.query({
      query:(officeIds:number[])=>`api/Admin/get-sessions/filter?officeIds=${officeIds.join(",")}`
    })
  })
})

export const { useGetPatientInfoQuery, usePostPatientInfoMutation, useGetSesionDetailsQuery, useUploadSignatureMutation, useLazyGetSesionDetailsQuery, useLazyGetSessionbyOfficeIdsQuery } = patientApi
