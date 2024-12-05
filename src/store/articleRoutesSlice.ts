import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RouteObject } from 'react-router-dom';

// 定义状态的类型
interface ArticleRoutesState {
    articleRoutesMap: RouteObject[];
}

// 初始化状态
const initialState: ArticleRoutesState = {
    articleRoutesMap: [],
};

// 创建 slice，确保 state 的类型被正确推断
const articleRoutesSlice = createSlice({
  name: 'articleRoutes',
  initialState,
  reducers: {
    setArticleRoutesMap(state, action: PayloadAction<RouteObject[]>) {
      state.articleRoutesMap = action.payload;
    },
  },
});

export const { setArticleRoutesMap } = articleRoutesSlice.actions;
export default articleRoutesSlice.reducer;
