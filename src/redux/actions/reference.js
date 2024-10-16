import axios from "../../axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchDistrictList = createAsyncThunk("emitents/fetchDistrictList", async () => {
  const { data } = await axios.get(`/holders/district/list`);
  return data;
})

export const fetchCreateDistrict = createAsyncThunk("emitents/fetchCreateDistrict", async (data) => {
  const response = await axios.post(`/holders/district`, data);
  return response.data;
})

export const fetchUpdateDistrict = createAsyncThunk("emitents/fetchUpdateDistrict", async ({ id, data }) => {
  const response = await axios.put(`/holders/district/${id}`, data);
  return response.data;
})

