import axios from "../../axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAllHolders = createAsyncThunk("holders/fetchAllHolders", async (eid) => {
  const { data } = await axios.get(`/holders`);
  return data;
})


export const fetchHolders = createAsyncThunk("holders/fetchHolders", async (eid) => {
  const { data } = await axios.get(`emitents/${eid}/all-holders`);
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

export const fetchUpdateHolder = createAsyncThunk("holders/fetchUpdateHolder", async ({ id, data }) => {
  const response = await axios.post(`/holders/document/create`, data);
  return response.data;
})

export const fetchHolderOperation = createAsyncThunk("holders/fetchHolderOperation", async ({eid,hid}) => {
  const { data } = await axios.get(`/prints/emitent/${eid}/account/${hid}`);
  return data;
})

export const fetchHoldersByEmitentId = createAsyncThunk("holders/fetchHoldersByEmitentId", async ({eid, type, emid}) => {
  const { data } = await axios.get(`/prints/emitent/${eid}/reestrs/holders?report_type=${type}&emission=${emid}`);
  return data;
})

//incoming documents
export const fetchEmitentHolderDocuments = createAsyncThunk("holders/fetchEmitentHolderDocuments", async (eid) => {
  const { data } = await axios.get(`/holders/document/emitent/${eid}`);
  return data;
})
// export const fetchDeleteEmitent = createAsyncThunk("holders/fetchDeleteEmitent", async (id) => {
//     await axios.delete(`/holders/${id}`);
// })