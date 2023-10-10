import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type SetStateAction,
  type Dispatch,
  useEffect,
} from 'react';

type Theme = 'light' | 'dark';

const ThemeContext = createContext<Theme>('light');
const SetThemeContext = createContext<Dispatch<SetStateAction<Theme>>>(
  undefined!
);

export function useTheme() {
  return useContext(ThemeContext);
}

export function useSetTheme() {
  return useContext(SetThemeContext);
}

export function ThemeProvider({ children }: { children?: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    setTheme(window.localStorage.getItem('theme') as Theme);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={theme}>
      <SetThemeContext.Provider value={setTheme}>
        {children}
      </SetThemeContext.Provider>
    </ThemeContext.Provider>
  );
}
