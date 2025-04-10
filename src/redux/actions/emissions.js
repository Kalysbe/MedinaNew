import axios from "../../axios";
import { createAsyncThunk } from "@reduxjs/toolkit";



export const fetchEmissionsByEmitentId = createAsyncThunk("emitents/fetchEmissionsByEmitentId", async (eid) => {
    const { data } = await axios.get(`/emitents/${eid}/emissions`);
    return data;
  })

  export const fetchEmissions = createAsyncThunk("emitents/fetchEmissions", async (eid) => {
    const { data } = await axios.get(`/emissions`);
    return data;
  })
  
export const fetchSecuritiesByEmitentId = createAsyncThunk("emitents/fetchSecuritiesByEmitentId", async (eid) => {
  const { data } = await axios.get(`/holders/${eid}/securities`);
  return data;
})

export const fetchEmissionsByHolderId = createAsyncThunk("emitents/fetchEmissionsByHolderId", async (hid) => {
  const { data } = await axios.get(`/holders/${hid}/emissions`);
  return data;
})

export const fetchEmissionById = createAsyncThunk("emitents/fetchEmissionById", async (esid) => {
  const { data } = await axios.get(`/emissions/${esid}`);
  return data;
})


export const fetchEmissionCancellation = createAsyncThunk(
  "emissions/fetchEmissionCancellation",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`emissions/${id}/cancel`, data);
      return response.data;
    } catch (err) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
