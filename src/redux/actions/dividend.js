import axios from "../../axios";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const fetchDividends = createAsyncThunk("dividend/fetchDividends", async (eid) => {
  const { data } = await axios.get(`/dividends/${eid}/all-list`);
  return data;
})

export const fetchDividendById = createAsyncThunk("dividend/fetchDividendById", async (id) => {
  const { data } = await axios.get(`/dividends/${id}/details`);
  return data;
})

  export const fetchCreateDividend = createAsyncThunk("emitents/fetchCreateDividend", async (data) => {
    const response = await axios.post(`/dividends`, data);
    return response.data;
  })

