import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  fetchAllHolders,
  fetchHolders,
  fetchHolderById,
  fetchAddHolder,
  fetchUpdateHolder,
  fetchHoldersByEmitentId,
  fetchHolderOperation,
  fetchEmitentHolderDocuments,
  fetchEmitentHolderDocumentById,
  fetchHolderEmitents,
  fetchBlockedSecuritiesHolders
} from '../actions/holders'

const initialState = {
  allholders: {
    items: [],
    status: "loading"
  },
  holders: {
    items: [],
    status: "loading"
  },
  holder: {
    data: {},
    status: "loading"
  },
  incomingDocuments: [],
  incomingDocument: {},
  emitents: []
}

const holdersSlice = createSlice({
  name: "holders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    builder
      .addCase(fetchAllHolders.pending, (state) => {
        state.allholders.items = [];
        state.allholders.status = "loading";
      })
      .addCase(fetchAllHolders.fulfilled, (state, action) => {
        state.allholders.items = action.payload;
        state.allholders.status = "loaded";
      })
      .addCase(fetchAllHolders.rejected, (state) => {
        state.allholders.items = [];
        state.allholders.status = "error";
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
      .addCase(fetchUpdateHolder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUpdateHolder.fulfilled, (state, action) => {
        state.status = "loaded";
        state.data = action.payload;
      })
      .addCase(fetchUpdateHolder.rejected, (state) => {
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

    //Входящие документа 

    builder
      .addCase(fetchEmitentHolderDocuments.pending, (state) => {
        state.incomingDocuments = [];
      })
      .addCase(fetchEmitentHolderDocuments.fulfilled, (state, action) => {
        state.incomingDocuments = action.payload;
      })
      .addCase(fetchEmitentHolderDocuments.rejected, (state) => {
        state.incomingDocuments = [];
      });

    builder
      .addCase(fetchEmitentHolderDocumentById.pending, (state) => {
        state.incomingDocument = [];
      })
      .addCase(fetchEmitentHolderDocumentById.fulfilled, (state, action) => {
        state.incomingDocument = action.payload;
      })
      .addCase(fetchEmitentHolderDocumentById.rejected, (state) => {
        state.incomingDocument = [];
      });

    builder
      .addCase(fetchHolderEmitents.pending, (state) => {
        state.emitents = [];
      })
      .addCase(fetchHolderEmitents.fulfilled, (state, action) => {
        state.emitents = action.payload;
      })
      .addCase(fetchHolderEmitents.rejected, (state) => {
        state.emitents = [];
      });

    builder
      .addCase(fetchBlockedSecuritiesHolders.pending, (state) => {
        state.holders.items = [];
        state.holders.status = "loading";
      })
      .addCase(fetchBlockedSecuritiesHolders.fulfilled, (state, action) => {
        state.holders.items = action.payload;
        state.holders.status = "loaded";
      })
      .addCase(fetchBlockedSecuritiesHolders.rejected, (state) => {
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