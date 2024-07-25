import axios from "../../axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
export const fetchHolders = createAsyncThunk("holders/fetchHolders", async (eid) => {
  const { data } = await axios.get(`emitents/${eid}/holders`);
  return data;
})
export const fetchHolderById = createAsyncThunk("holders/fetchHolderById", async (id) => {
  const { data } = await axios.get(`/holders/${id}`);
  return data;
})

export const fetchAddHolder = createAsyncThunk("holders/fetchAddHolder", async (data) => {
  const response = await axios.post(`/holders`, data);
  return response.data;
})

export const fetchHoldersByEmitentId = createAsyncThunk("holders/fetchHoldersByEmitentId", async ({eid, type}) => {
  const { data } = await axios.get(`/prints/emitent/${eid}/reestrs/holders?report_type=${type}`);
  return data;
})
// export const fetchDeleteEmitent = createAsyncThunk("holders/fetchDeleteEmitent", async (id) => {
//     await axios.delete(`/holders/${id}`);
// })