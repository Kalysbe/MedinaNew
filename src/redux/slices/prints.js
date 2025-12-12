import { createSlice } from '@reduxjs/toolkit';
import { fetchCardEmitent, fetchExtractReestr, fetchTransactionPrintById, fetchQuarterlyPrint } from '../actions/prints'; // Импортируйте ваши асинхронные действия

const initialState = {
  prints: {
    cardEmitent: {
      data: {},
      status: 'loading',
    },
    extractReestr: {
      data: {},
      status: 'loading',
    },
    transactionPrint: {
      data: {},
      status: 'loading',
    },
    quarterlyPrint: {
      data: {},
      status: 'loading',
    },
  },
};

const printsSlice = createSlice({
  name: 'prints',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCardEmitent.pending, (state) => {
        state.prints.cardEmitent.data = [];
        state.prints.cardEmitent.status = 'loading';
      })
      .addCase(fetchCardEmitent.fulfilled, (state, action) => {
        state.prints.cardEmitent.data = action.payload;
        state.prints.cardEmitent.status = 'loaded';
      })
      .addCase(fetchCardEmitent.rejected, (state) => {
        state.prints.cardEmitent.data = [];
        state.prints.cardEmitent.status = 'error';
      });

    builder
      .addCase(fetchExtractReestr.pending, (state) => {
        state.prints.extractReestr.data = [];
        state.prints.extractReestr.status = 'loading';
      })
      .addCase(fetchExtractReestr.fulfilled, (state, action) => {
        state.prints.extractReestr.data = action.payload;
        state.prints.extractReestr.status = 'loaded';
      })
      .addCase(fetchExtractReestr.rejected, (state) => {
        state.prints.extractReestr.data = [];
        state.prints.extractReestr.status = 'error';
      });

    builder
      .addCase(fetchTransactionPrintById.pending, (state) => {
        state.prints.transactionPrint.data = [];
        state.prints.transactionPrint.status = 'loading';
      })
      .addCase(fetchTransactionPrintById.fulfilled, (state, action) => {
        state.prints.transactionPrint.data = action.payload;
        state.prints.transactionPrint.status = 'loaded';
      })
      .addCase(fetchTransactionPrintById.rejected, (state) => {
        state.prints.transactionPrint.data = [];
        state.prints.transactionPrint.status = 'error';
      });

    builder
      .addCase(fetchQuarterlyPrint.pending, (state) => {
        state.prints.quarterlyPrint.data = [];
        state.prints.quarterlyPrint.status = 'loading';
      })
      .addCase(fetchQuarterlyPrint.fulfilled, (state, action) => {
        state.prints.quarterlyPrint.data = action.payload;
        state.prints.quarterlyPrint.status = 'loaded';
      })
      .addCase(fetchQuarterlyPrint.rejected, (state) => {
        state.prints.quarterlyPrint.data = [];
        state.prints.quarterlyPrint.status = 'error';
      });
  },
});

export const printsReducer = printsSlice.reducer;
