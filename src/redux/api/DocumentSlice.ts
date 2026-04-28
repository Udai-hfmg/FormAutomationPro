import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";

const BASR_URL = import.meta.env.VITE_BASE_URL

export const documentApi = createApi({
    reducerPath:"documentApi",
    baseQuery:fetchBaseQuery({baseUrl:BASR_URL}),
    endpoints:(builder)=>({
        getDocumentTypes:builder.query({
            query:()=>"api/DocumentType"
        }),
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
        }) , 
        postArchiveDocument:builder.mutation({
            query:(data)=>({
                url:"api/DocumentTypeVersion/archived",
                method:"POST",
                body:data
            })
        }) ,
        getArchivedFacilityIds:builder.query({
            query:(facilityId)=>`api/DocumentTypeVersion/archived/${facilityId}`
        }),
        getArchivedFormsByIds:builder.query({
            query:(ids)=>`/api/DocumentTypeVersion/archived/form?ids=${ids.join(",")}`
        })
    })
})

export const {useGetDocumentsQuery, usePostDocumentVersionMutation, useGetSubmissionDocumentQuery, useGetDocumentTypesQuery , usePostArchiveDocumentMutation , useGetArchivedFacilityIdsQuery , useLazyGetArchivedFacilityIdsQuery , useGetArchivedFormsByIdsQuery}  = documentApi