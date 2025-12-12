import axios from "../../axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchQuarterlyReport = createAsyncThunk(
  "quarterly/fetchQuarterlyReport",
  async ({ emitentId, year, quarter }) => {
    const params = new URLSearchParams();

    if (emitentId) {
      params.append("emitent_id", emitentId);
    }
    if (year) {
      params.append("year", year);
    }
    if (quarter) {
      params.append("quarter", quarter);
    }

    const query = params.toString();
    const endpoint = query ? `/reports/quarterly?${query}` : "/reports/quarterly";

    const { data } = await axios.get(endpoint);
    return data;
  }
);








