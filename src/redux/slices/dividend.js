import { createSlice } from "@reduxjs/toolkit";
import { fetchDividends,fetchDividendById,fetchCreateDividend } from '../actions/dividend'


const initialState = {
  dividends: {
    items: [],
    status: "loading"
  },
  dividend: {
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
    .addCase(fetchDividends.pending, (state) => {
      state.dividends.items = [];
      state.dividends.status = "loading";
    })
    .addCase(fetchDividends.fulfilled, (state, action) => {
      state.dividends.items = action.payload;
      state.dividends.status = "loaded";
    })
    .addCase(fetchDividends.rejected, (state) => {
      state.dividends.items = [];
      state.dividends.status = "error";
    });

  builder
    .addCase(fetchDividendById.pending, (state) => {
      state.dividend.status = "loading";
    })
    .addCase(fetchDividendById.fulfilled, (state, action) => {
      state.dividend.data = action.payload;
      state.dividend.status = "loaded";
    })
    .addCase(fetchDividendById.rejected, (state) => {
      state.dividend.data = {};
      state.dividend.status = "error";
    });

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