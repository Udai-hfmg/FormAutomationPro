import { configureStore } from "@reduxjs/toolkit";
import {documentApi} from './src/redux/api/DocumentSlice'

const store = configureStore({
    reducer :{
       [documentApi.reducerPath]:documentApi.reducer 
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(documentApi.middleware),
})

export default store