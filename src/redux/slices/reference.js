import { createSlice } from "@reduxjs/toolkit";
import { fetchDistrictList, fetchHolderTypeList, fetchEmissionTypeList, fetchHolderStatusList } from '../actions/reference'


const initialState = {
  districtList: [],
  holderTypeList: [],
  emissionTypeList: [],
  holderStatusList: []
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
    
    builder
      .addCase(fetchEmissionTypeList.pending, (state) => {
        state.emissionTypeList = [];
      })
      .addCase(fetchEmissionTypeList.fulfilled, (state, action) => {
        state.emissionTypeList = action.payload;
      })
      .addCase(fetchEmissionTypeList.rejected, (state) => {
        state.emissionTypeList = [];
      });

    builder
      .addCase(fetchHolderStatusList.pending, (state) => {
        state.holderStatusList = [];
      })
      .addCase(fetchHolderStatusList.fulfilled, (state, action) => {
        state.holderStatusList = action.payload;
      })
      .addCase(fetchHolderStatusList.rejected, (state) => {
        state.holderStatusList = [];
      });
    
  },
});


export const referenceReducer = referenceSlice.reducer