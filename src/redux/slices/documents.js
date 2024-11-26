import { createSlice } from "@reduxjs/toolkit";
import { fetchDocuments, fetchDocumentById } from '../actions/documents'


const initialState = {
  documentList: [],
  documentDetail: {}
}

const documentSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.documentList = [];
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.documentList = action.payload;
      })
      .addCase(fetchDocuments.rejected, (state) => {
        state.documentList = [];
      });
    builder
      .addCase(fetchDocumentById.pending, (state) => {
        state.documentDetail = {};
      })
      .addCase(fetchDocumentById.fulfilled, (state, action) => {
        state.documentDetail = action.payload;
      })
      .addCase(fetchDocumentById.rejected, (state) => {
        state.documentDetail = {};
      });
    
  },
});


export const documentsReducer = documentSlice.reducer