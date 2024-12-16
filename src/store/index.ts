// src/store/index.ts

import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
import articleRoutesReducer from "./articleRoutesSlice";
import routesReducer from "./routersMapSlice";
const store = configureStore({
  reducer: {
    theme: themeReducer,
    articleRoutes: articleRoutesReducer,
    routesMap: routesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
