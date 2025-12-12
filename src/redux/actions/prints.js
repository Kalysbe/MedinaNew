import axios from "../../axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCardEmitent = createAsyncThunk("prints/fetchCardEmitent", async (id) => {
  const { data } = await axios.get(`/prints/emitent/${id}/card`);
  return data;
})

export const fetchExtractReestr = createAsyncThunk("prints/fetchExtractReestr", async ({eid, hid}) => {
  const { data } = await axios.get(`/prints/emitent/${eid}/reestr/${hid}`);
  return data;
})

export const fetchTransactionPrintById = createAsyncThunk("prints/fetchTransactionPrintById", async (tid) => {
  const { data } = await axios.get(`/prints/transaction/${tid}`);
  return data;
})

export const fetchQuarterlyPrint = createAsyncThunk("prints/fetchQuarterlyPrint", async ({quarter, year}) => {
  const { data } = await axios.get(`/prints/kvartal?quarter=${quarter}&year=${year}`);
  return data;
})



