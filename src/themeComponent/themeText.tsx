import React, { CSSProperties, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
interface ThemeTextProps {
  children: ReactNode;
  style?: CSSProperties; 
  lightStyle?:CSSProperties;
  darkStyle?:CSSProperties;
}

const ThemeText: React.FC<ThemeTextProps> = ({ style,lightStyle,darkStyle,children }) => {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);

  return (
    <div
      className={isDarkMode ? 'dark-mode' : 'light-mode'}
      style={{
        ...style,
        ...(isDarkMode ? darkStyle : lightStyle),
      }}
    >
      {children}
    </div>
  );
};

export default ThemeText;
