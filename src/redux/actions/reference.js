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



