import { createContext, useCallback, useContext, useState } from "react";

const ThemeValueContext = createContext();
const ThemeSetterContext = createContext();

const useTheme = () => {
  const theme = useContext(ThemeValueContext);
  return theme;
};

const useToggleTheme = () => {
  const toggleTheme = useContext(ThemeSetterContext);
  return toggleTheme;
};

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      return prev === "light" ? "dark" : "light";
    });
  }, []);

  return (
    <ThemeValueContext.Provider value={theme}>
      <ThemeSetterContext.Provider value={toggleTheme}>
        {children}
      </ThemeSetterContext.Provider>
    </ThemeValueContext.Provider>
  );
};

export { ThemeProvider, useTheme, useToggleTheme };
