import { configureStore } from "@reduxjs/toolkit";
import {documentApi} from './src/redux/api/DocumentSlice'
import { patientApi } from "./src/redux/api/PatienSlice";

const store = configureStore({
    reducer :{
       [documentApi.reducerPath]:documentApi.reducer ,
       [patientApi.reducerPath]:patientApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(documentApi.middleware).concat(patientApi.middleware),
})

export default store