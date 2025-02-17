import axios from "../../axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchDistrictList = createAsyncThunk("reference/fetchDistrictList", async () => {
  const { data } = await axios.get(`/holders/district/list`);
  return data;
})

export const fetchCreateDistrict = createAsyncThunk("reference/fetchCreateDistrict", async (data) => {
  const response = await axios.post(`/holders/district`, data);
  return response.data;
})

export const fetchUpdateDistrict = createAsyncThunk("reference/fetchUpdateDistrict", async ({ id, data }) => {
  console.log(id,data)
  const response = await axios.put(`/holders/district/${id}`, data);
  return response.data;
})

export const fetchHolderTypeList = createAsyncThunk("reference/fetchHolderTypeList", async () => {
  const { data } = await axios.get(`/holders/holder-types`);
  return data;
})

export const fetchCreateHolderType = createAsyncThunk("reference/fetchCreateHolderType", async (data) => {
  const response = await axios.post(`/holders/holder-types`, data);
  return response.data;
})

export const fetchUpdateHolderType = createAsyncThunk("reference/fetchUpdateHolderType", async ({ id, data }) => {
  const response = await axios.put(`/holders/holder-types/${id}`, data);
  return response.data;
})

export const fetchEmissionTypeList = createAsyncThunk("reference/fetchEmissionTypeList", async () => {
  const { data } = await axios.get(`/emissions/types`, data);
  return data;
})
export const fetchCreateEmissionType = createAsyncThunk("reference/fetchCreateEmissionType", async (data) => {
  const response = await axios.post(`emissions/types`, data);
  return response.data;
})
export const fetchUpdateEmissionType = createAsyncThunk("reference/fetchCreateEmissionType", async ({id, data }) => {
  const response = await axios.put(`emissions/types`, data);
  return response.data;
})



