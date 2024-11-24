// src/store/index.ts

import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import routesReducer from "./routesSlice";

const store = configureStore({
  reducer: {
    theme: themeReducer,
    routes: routesReducer, // 注册动态路由 Slice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
