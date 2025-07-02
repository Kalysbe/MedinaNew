import { createSlice } from "@reduxjs/toolkit";
import { fetchEmissionsByHolderId ,fetchEmissions, fetchEmissionsByEmitentId , fetchEmissionById, fetchSecuritiesByEmitentId, fetchSecuritiesByHolderIdEmitentId} from '../actions/emissions'


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

const emissionsSlice = createSlice({
  name: "emissions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    builder
      .addCase(fetchEmissionsByHolderId.pending, (state) => {
        state.emissions.items = [];
        state.emissions.status = "loading";
      })
      .addCase(fetchEmissionsByHolderId.fulfilled, (state, action) => {
        state.emissions.items = action.payload;
        state.emissions.status = "loaded";
      })
      .addCase(fetchEmissionsByHolderId.rejected, (state) => {
        state.emissions.items = [];
        state.emissions.status = "error";
      });
    builder
      .addCase(fetchEmissions.pending, (state) => {
        state.emissions.items = [];
        state.emissions.status = "loading";
      })
      .addCase(fetchEmissions.fulfilled, (state, action) => {
        state.emissions.items = action.payload;
        state.emissions.status = "loaded";
      })
      .addCase(fetchEmissions.rejected, (state) => {
        state.emissions.items = [];
        state.emissions.status = "error";
      });
    builder
      .addCase(fetchSecuritiesByEmitentId.pending, (state) => {
        state.emissions.items = [];
        state.emissions.status = "loading";
      })
      .addCase(fetchSecuritiesByEmitentId.fulfilled, (state, action) => {
        state.emissions.items = action.payload;
        state.emissions.status = "loaded";
      })
      .addCase(fetchSecuritiesByEmitentId.rejected, (state) => {
        state.emissions.items = [];
        state.emissions.status = "error";
      });
    builder
      .addCase(fetchSecuritiesByHolderIdEmitentId.pending, (state) => {
        state.emissions.items = [];
        state.emissions.status = "loading";
      })
      .addCase(fetchSecuritiesByHolderIdEmitentId.fulfilled, (state, action) => {
        state.emissions.items = action.payload;
        state.emissions.status = "loaded";
      })
      .addCase(fetchSecuritiesByHolderIdEmitentId.rejected, (state) => {
        state.emissions.items = [];
        state.emissions.status = "error";
      });
      builder
      .addCase(fetchEmissionsByEmitentId.pending, (state) => {
        state.emissions.items = [];
        state.emissions.status = "loading";
      })
      .addCase(fetchEmissionsByEmitentId.fulfilled, (state, action) => {
        state.emissions.items = action.payload;
        state.emissions.status = "loaded";
      })
      .addCase(fetchEmissionsByEmitentId.rejected, (state) => {
        state.emissions.items = [];
        state.emissions.status = "error";
      });
      builder
      .addCase(fetchEmissionById.pending, (state) => {
        state.emissionDetail.data = {};
        state.emissionDetail.status = "loading";
      })
      .addCase(fetchEmissionById.fulfilled, (state, action) => {
        state.emissionDetail.data = action.payload;
        state.emissionDetail.status = "loaded";
      })
      .addCase(fetchEmissionById.rejected, (state) => {
        state.emissionDetail.data = {};
        state.emissionDetail.status = "error";
      });
  },
});


export const emissionsReducer = emissionsSlice.reducer