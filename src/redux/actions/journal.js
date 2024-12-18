import axios from "../../axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchJournalList = createAsyncThunk("journal/fetchJournalList", async () => {
  const { data } = await axios.get(`/journals`);
  return data;
})

export const fetchJournalById = createAsyncThunk("journal/fetchJournalById", async (id) => {
    const { data } = await axios.get(`/journals/${id}`);
    return data;
  })
  







