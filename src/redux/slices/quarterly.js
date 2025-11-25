import { createSlice } from "@reduxjs/toolkit";
import { fetchQuarterlyReport } from "../actions/quarterly";

const initialState = {
  report: {
    rows: [],
    columns: [],
    meta: {},
    status: "idle",
    error: null,
  },
};

const quarterlySlice = createSlice({
  name: "quarterly",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuarterlyReport.pending, (state) => {
        state.report.status = "loading";
        state.report.error = null;
      })
      .addCase(fetchQuarterlyReport.fulfilled, (state, action) => {
        state.report.status = "loaded";
        const payload = action.payload || {};
        const rows = payload.rows || payload.data || payload.items || [];
        const columns = payload.columns || [];

        state.report.rows = Array.isArray(rows) ? rows : [];
        state.report.columns = Array.isArray(columns) ? columns : [];
        state.report.meta = payload.meta || {};
      })
      .addCase(fetchQuarterlyReport.rejected, (state, action) => {
        state.report.status = "error";
        state.report.error =
          action.error?.message || "Не удалось загрузить квартальный отчёт";
      });
  },
});

export const quarterlyReducer = quarterlySlice.reducer;



