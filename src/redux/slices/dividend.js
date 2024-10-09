import { createSlice } from "@reduxjs/toolkit";
import { fetchCreateDividend } from '../actions/dividend'


const initialState = {
  emissions: {
    items: [],
    status: "loading"
  },
  emissionDetail: {
    data: {},
    status: "loading"
  }
}

const dividendSlice = createSlice({
  name: "dividend",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    builder
    .addCase(fetchCreateDividend.pending, (state) => {
      state.status = "loading";
    })
    .addCase(fetchCreateDividend.fulfilled, (state, action) => {
      state.status = "loaded";
      state.data = action.payload;
    })
    .addCase(fetchCreateDividend.rejected, (state) => {
      state.status = "error";
    });
  
  },
});


export const dividendReducer = dividendSlice.reducer