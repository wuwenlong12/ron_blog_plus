import React, { CSSProperties, ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

interface ThemeViewProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  lightStyle?: CSSProperties;
  darkStyle?: CSSProperties;
  onClick?: () => void;
}

const ThemeView: React.FC<ThemeViewProps> = ({
  style,
  lightStyle,
  darkStyle,
  children,
  className,
  onClick,
}) => {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);

  return (
    <div
      className={`${isDarkMode ? "dark-mode" : "light-mode"} ${className}`}
      onClick={onClick}
      style={{
        backgroundColor: isDarkMode ? "#000" : "#fff",
        ...style,
        ...(isDarkMode ? darkStyle : lightStyle),
      }}
    >
      {children}
    </div>
  );
};

export default ThemeView;
