import { createSlice } from "@reduxjs/toolkit";
import { fetchDistrictList } from '../actions/reference'


const initialState = {
  districtList: [],
  emissionDetail: {
    data: {},
    status: "loading"
  }
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
    
  },
});


export const referenceReducer = referenceSlice.reducer