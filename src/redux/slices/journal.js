import { createSlice } from "@reduxjs/toolkit";
import { fetchJournalList, fetchJournalById } from '../actions/journal'


const initialState = {
  journalList: [],
  journalDetail: {}
}

const journalSlice = createSlice({
  name: "journal",
  initialState,
  reducers: {},

  extraReducers: (builder) => {

    builder
      .addCase(fetchJournalList.pending, (state) => {
        state.journalList = [];
      })
      .addCase(fetchJournalList.fulfilled, (state, action) => {
        state.journalList = action.payload;
      })
      .addCase(fetchJournalList.rejected, (state) => {
        state.journalList = [];
      });
    builder
      .addCase(fetchJournalById.pending, (state) => {
        state.journalDetail = {};
      })
      .addCase(fetchJournalById.fulfilled, (state, action) => {
        state.journalDetail = action.payload;
      })
      .addCase(fetchJournalById.rejected, (state) => {
        state.journalDetail = {};
      });
    
  },
});


export const journalReducer = journalSlice.reducer