import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 读取localStorage中的主题设置
const savedTheme = localStorage.getItem('isDarkMode');
interface ThemeState {
  isDarkMode: boolean;
  isSystemPreference: boolean;
}

const initialState: ThemeState = {
  isDarkMode: savedTheme === 'true',
  isSystemPreference: !savedTheme, // 没有用户设置时，跟随系统
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.isDarkMode = !state.isDarkMode;
      localStorage.setItem('isDarkMode', state.isDarkMode.toString());
    },
    setBySystemTheme(state, actions: PayloadAction<boolean>) {
        const systemPrefersDark = actions.payload;
        state.isDarkMode = systemPrefersDark;
        localStorage.removeItem('isDarkMode')
    }
  }
});

export const { toggleTheme, setBySystemTheme } = themeSlice.actions;
export default themeSlice.reducer;
