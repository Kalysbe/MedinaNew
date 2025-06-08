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
  const response = await axios.put(`emissions/types/${id}`, data);
  return response.data;
})

export const fetchHolderStatusList = createAsyncThunk("reference/fetchHolderStatusList", async () => {
  const { data } = await axios.get(`/holders/holder-status`);
  return data;
})

export const fetchCreateHolderStatus = createAsyncThunk("reference/fetchCreateHolderStatus", async (data) => {
  const response = await axios.post(`/holders/holder-status`, data);
  return response.data;
})

export const fetchUpdateHolderStatus = createAsyncThunk("reference/fetchUpdateHolderStatus", async ({ id, data }) => {
  const response = await axios.put(`/holders/holder-status/${id}`, data);
  return response.data;
})

export const fetchDeleteEmissionType = createAsyncThunk(
  "reference/fetchDeleteEmissionType",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`emissions/types/${id}`);
      return response.data;
    } catch (err) {
      // Если от бэкенда пришёл ответ с ошибкой
      if (err.response && err.response.data) {
        // Прокидываем текст ошибки (или весь объект) в rejectWithValue
        return rejectWithValue(err.response.data.message);
      }
      // Если это какая-то другая ошибка (без response.data), кидаем обычное err.message
      return rejectWithValue(err.message);
    }
  }
);

