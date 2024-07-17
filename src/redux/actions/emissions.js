import axios from "../../axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchEmissionsByEmitentId = createAsyncThunk("emitents/fetchEmissionsByEmitentId", async (eid) => {
    const { data } = await axios.get(`/emitents/${eid}/emissions`);
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