import { createSlice } from "@reduxjs/toolkit";
import { fetchEmitents, fetchEmitentById, fetchAddEmitent, fetchUpdateEmitent, fetchDeleteEmitent, fetchEmitentEmissions ,fetchAddEmitentEmissions} from '../actions/emitents'


const initialState = {
  emitents: {
    items: [],
    status: "loading"
  },
  emitent: {
    data: {},
    status: "loading"
  },
  emitentEmissions: {
    items: [],
    status: "loading"
  }
}

const emitentsSlice = createSlice({
  name: "emitents",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Действия для получения эмитентов
    builder
      .addCase(fetchEmitents.pending, (state) => {
        state.emitents.items = [];
        state.emitents.status = "loading";
      })
      .addCase(fetchEmitents.fulfilled, (state, action) => {
        state.emitents.items = action.payload;
        state.emitents.status = "loaded";
      })
      .addCase(fetchEmitents.rejected, (state) => {
        state.emitents.items = [];
        state.emitents.status = "error";
      });

    builder
      .addCase(fetchEmitentById.pending, (state) => {
        state.emitent.status = "loading";
      })
      .addCase(fetchEmitentById.fulfilled, (state, action) => {
        state.emitent.data = action.payload;
        state.emitent.status = "loaded";
      })
      .addCase(fetchEmitentById.rejected, (state) => {
        state.emitent.data = {};
        state.emitent.status = "error";
      });

    builder
      .addCase(fetchAddEmitent.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAddEmitent.fulfilled, (state, action) => {
        state.status = "loaded";
        state.data = action.payload;
      })
      .addCase(fetchAddEmitent.rejected, (state) => {
        state.status = "error";
      });

    builder
      .addCase(fetchUpdateEmitent.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUpdateEmitent.fulfilled, (state, action) => {
        state.status = "loaded";
        state.data = action.payload;
      })
      .addCase(fetchUpdateEmitent.rejected, (state) => {
        state.status = "error";
      });
      builder
      .addCase(fetchEmitentEmissions.pending, (state) => {
        state.emitentEmissions.items = [];
        state.emitentEmissions.status = "loading";
      })
      .addCase(fetchEmitentEmissions.fulfilled, (state, action) => {
        state.emitentEmissions.items = action.payload;
        state.emitentEmissions.status = "loaded";
      })
      .addCase(fetchEmitentEmissions.rejected, (state) => {
        state.emitentEmissions.items = [];
        state.emitentEmissions.status = "error";
      });

      builder
      .addCase(fetchAddEmitentEmissions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAddEmitentEmissions.fulfilled, (state, action) => {
        state.status = "loaded";
        state.data = action.payload;
      })
      .addCase(fetchAddEmitentEmissions.rejected, (state) => {
        state.status = "error";
      });

    
    // Действия для удаления эмитента
    builder.addCase(fetchDeleteEmitent.pending, (state, action) => {
      const postIdToRemove = action.meta.arg;
      state.emitents.items = state.emitents.items.filter((obj) => obj._id !== postIdToRemove);
    });
  },
});


export const emitentsReducer = emitentsSlice.reducer