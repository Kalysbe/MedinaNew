import { createSlice } from "@reduxjs/toolkit";
import { fetchDistrictList, fetchHolderTypeList } from '../actions/reference'


const initialState = {
  districtList: [],
  holderTypeList: []
}

const referenceSlice = createSlice({
  name: "reference",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    builder
      .addCase(fetchDistrictList.pending, (state) => {
        state.districtList = [];
      })
      .addCase(fetchDistrictList.fulfilled, (state, action) => {
        state.districtList = action.payload;
      })
      .addCase(fetchDistrictList.rejected, (state) => {
        state.districtList = [];
      });
    builder
      .addCase(fetchHolderTypeList.pending, (state) => {
        state.holderTypeList = [];
      })
      .addCase(fetchHolderTypeList.fulfilled, (state, action) => {
        state.holderTypeList = action.payload;
      })
      .addCase(fetchHolderTypeList.rejected, (state) => {
        state.holderTypeList = [];
      });
    
  },
});


export const referenceReducer = referenceSlice.reducer