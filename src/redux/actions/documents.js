import axios from "../../axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchDocuments = createAsyncThunk("document/fetchDocuments", async (eid) => {
  const { data } = await axios.get(`/documents/emitent/${eid}`);
  return data;
})

export const fetchDocumentById = createAsyncThunk("document/fetchDocumentById", async (id) => {
    const { data } = await axios.get(`/documents/${id}`);
    return data;
  })

export const fetchCreateDocument = createAsyncThunk("document/fetchCreateDocument", async (data) => {
  const response = await axios.post(`/documents`, data);
  return response.data;
})

export const fetchUpdateDocument = createAsyncThunk("document/fetchUpdateDocument", async ({ id, data }) => {
  const response = await axios.put(`/documents/${id}`, data);
  return response.data;
})





