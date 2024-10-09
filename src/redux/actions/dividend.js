import axios from "../../axios";
import { createAsyncThunk } from "@reduxjs/toolkit";



export const fetchCreateDividend = createAsyncThunk("dividend/fetchCreateDividend", async (eid) => {
    const { data } = await axios.post(`/dividends`);
    return data;
  })

