// src/store/index.ts

import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
import routesReducer from "./routersMapSlice";
import authReducer from "./authSlice";
import siteReducer from "./siteSlice";
import modalReducer from "./modalSlice";

const store = configureStore({
  reducer: {
    theme: themeReducer,
    routesMap: routesReducer,
    auth: authReducer,
    site: siteReducer,
    modal: modalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
