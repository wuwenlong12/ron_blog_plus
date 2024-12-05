// src/store/index.ts

import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import articleRoutesReducer from './articleRoutesSlice';
const store = configureStore({
  reducer: {
    theme: themeReducer,
    articleRoutes: articleRoutesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
