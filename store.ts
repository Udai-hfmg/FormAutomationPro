import { configureStore } from "@reduxjs/toolkit";
import { documentApi } from './src/redux/api/DocumentSlice'
import { patientApi } from "./src/redux/api/PatienSlice";
import { adminApiSlice } from "./src/redux/api/AdminSlice";

const store = configureStore({
    reducer: {
        [documentApi.reducerPath]: documentApi.reducer,
        [patientApi.reducerPath]: patientApi.reducer,
        [adminApiSlice.reducerPath]: adminApiSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(documentApi.middleware).concat(patientApi.middleware).concat(adminApiSlice.middleware),
})

export default store