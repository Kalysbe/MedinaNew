import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from './slices/auth';
import { emitentsReducer } from './slices/emitents';
import { holdersReducer } from './slices/holders';
import { emissionsReducer } from './slices/emissions';
import { transactionsReducer } from './slices/transactions';
import { printsReducer } from './slices/prints';
import { dividendReducer } from './slices/dividend';

const store = configureStore({
    reducer: {
        auth: authReducer,
        emitents: emitentsReducer,
        holders: holdersReducer,
        emissions:emissionsReducer,
        prints: printsReducer,
        transactions:transactionsReducer,
        dividend:dividendReducer
    }
})

export default store;