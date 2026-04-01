import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";

const BASR_URL = import.meta.env.VITE_BASE_URL

export const documentApi = createApi({
    reducerPath:"documentApi",
    baseQuery:fetchBaseQuery({baseUrl:BASR_URL}),
    endpoints:(builder)=>({
        getDocuments:builder.query({
            query:()=>"api/DocumentTypeVersion"
        }) , 
        postDocumentVersion:builder.mutation({
            query:(data)=>({
                url:"api/DocumentTypeVersion",
                method:"POST",
                body:data
            })
        }), 
        getSubmissionDocument:builder.query({
            query:()=>'api/Admin/get-sessions'
        })
    })
})

export const {useGetDocumentsQuery, usePostDocumentVersionMutation, useGetSubmissionDocumentQuery}  = documentApi