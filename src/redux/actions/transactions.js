import axios from "../../axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchTransactions = createAsyncThunk("transactions/fetchTransactions", async (eid) => {
    const response = await axios.get(`/transactions/emitent/${eid}`, );
    return response.data;
})

export const fetchTransactionById = createAsyncThunk("transactions/fetchTransactionById", async (id) => {
    const response = await axios.get(`/transactions/${id}`);
    return response.data;
})

export const fetchCreateTransaction = createAsyncThunk(
    "transactions/fetchCreateTransaction",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post("/transactions", data);
            return response.data;
        } catch (err) {
            if (err.response && err.response.data) {
                // Возвращаем данные ошибки через rejectWithValue
                return rejectWithValue(err.response.data);
            } else {
                return rejectWithValue({ message: err.message });
            }
        }
    }
);

export const fetchOperationTypes = createAsyncThunk("transactions/fetchOperationTypes", async () => {
    const { data } = await axios.get("/transactions/operations");
    return data;
})


// export const fetchDeleteEmitent = createAsyncThunk("holders/fetchDeleteEmitent", async (id) => {
//     await axios.delete(`/holders/${id}`);
// })