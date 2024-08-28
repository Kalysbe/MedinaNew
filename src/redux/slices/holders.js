import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {fetchAllHolders, fetchHolders, fetchHolderById, fetchAddHolder, fetchHoldersByEmitentId, fetchHolderOperation } from '../actions/holders'

const initialState = {
  holders: {
    items: [],
    status: "loading"
  },
  holder: {
    data: {},
    status: "loading"
  }
}

const holdersSlice = createSlice({
  name: "holders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    
    builder
    .addCase(fetchAllHolders.pending, (state) => {
      state.holders.items = [];
      state.holders.status = "loading";
    })
    .addCase(fetchAllHolders.fulfilled, (state, action) => {
      state.holders.items = action.payload;
      state.holders.status = "loaded";
    })
    .addCase(fetchAllHolders.rejected, (state) => {
      state.holders.items = [];
      state.holders.status = "error";
    });

    builder
      .addCase(fetchHolders.pending, (state) => {
        state.holders.items = [];
        state.holders.status = "loading";
      })
      .addCase(fetchHolders.fulfilled, (state, action) => {
        state.holders.items = action.payload;
        state.holders.status = "loaded";
      })
      .addCase(fetchHolders.rejected, (state) => {
        state.holders.items = [];
        state.holders.status = "error";
      });

    builder
      .addCase(fetchHolderById.pending, (state) => {
        state.holder.status = "loading";
      })
      .addCase(fetchHolderById.fulfilled, (state, action) => {
        state.holder.data = action.payload;
        state.holder.status = "loaded";
      })
      .addCase(fetchHolderById.rejected, (state) => {
        state.holder.data = {};
        state.holder.status = "error";
      });
      builder
      .addCase(fetchAddHolder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAddHolder.fulfilled, (state, action) => {
        state.status = "loaded";
        state.data = action.payload;
      })
      .addCase(fetchAddHolder.rejected, (state) => {
        state.status = "error";
      });

      builder
      .addCase(fetchHolderOperation.pending, (state) => {
        state.holder.status = "loading";
      })
      .addCase(fetchHolderOperation.fulfilled, (state, action) => {
        state.holder.data = action.payload;
        state.holder.status = "loaded";
      })
      .addCase(fetchHolderOperation.rejected, (state) => {
        state.holder.data = {};
        state.holder.status = "error";
      });

      builder
      .addCase(fetchHoldersByEmitentId.pending, (state) => {
        state.holders.items = [];
        state.holders.status = "loading";
      })
      .addCase(fetchHoldersByEmitentId.fulfilled, (state, action) => {
        state.holders.items = action.payload;
        state.holders.status = "loaded";
      })
      .addCase(fetchHoldersByEmitentId.rejected, (state) => {
        state.holders.items = [];
        state.holders.status = "error";
      });
    // Действия для удаления эмитента
    // builder.addCase(fetchDeleteEmitent.pending, (state, action) => {
    //   const postIdToRemove = action.meta.arg;
    //   state.holders.items = state.holders.items.filter((obj) => obj._id !== postIdToRemove);
    // });
  },
});


export const holdersReducer = holdersSlice.reducer