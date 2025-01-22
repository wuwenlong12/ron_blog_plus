// src/store/index.ts

import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
import articleRoutesReducer from "./articleRoutesSlice";
import routesReducer from "./routersMapSlice";
import authReducer from "./authSlice";
const store = configureStore({
  reducer: {
    theme: themeReducer,
    articleRoutes: articleRoutesReducer,
    routesMap: routesReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
