// src/hooks/useTheme.ts
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { setBySystemTheme, toggleTheme } from '../store/themeSlice';

const useTheme = () => {
  const dispatch: AppDispatch = useDispatch();
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);

  // 监听系统的颜色方案，设置初始模式
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      dispatch(setBySystemTheme(mediaQuery.matches));
    };
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [dispatch]);

  // 设置页面背景色和字体颜色
  useEffect(() => {
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
        // document.body.setAttribute('data-theme', isDarkMode ? 'light' : 'dark');
      } else {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
        // document.body.setAttribute('data-theme', isDarkMode ? 'light' : 'dark');
      }
  }, [isDarkMode]);

  // 切换模式的处理函数
  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return { isDarkMode, handleToggleTheme };
};

export default useTheme;
