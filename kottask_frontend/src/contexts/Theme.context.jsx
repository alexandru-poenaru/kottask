import { createContext, useState, useCallback, useMemo } from 'react';

export const themes = {
  dracula: 'dracula',
  winter: 'winter',
};

const switchTheme = (theme) =>
  theme === themes.dracula ? themes.winter : themes.dracula;

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    sessionStorage.getItem('themeMode') || themes.dracula,
  );

  const toggleTheme = useCallback(() => {
    const newThemeValue = switchTheme(theme);
    setTheme(newThemeValue);
    sessionStorage.setItem('themeMode', newThemeValue);
  }, [theme]);

  const value = useMemo(
    () => ({ theme, toggleTheme }),
    [theme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
