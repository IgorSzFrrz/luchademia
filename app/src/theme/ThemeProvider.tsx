import { createContext, ReactNode, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { LD_DARK, LD_LIGHT, Theme } from './tokens';

const ThemeCtx = createContext<Theme>(LD_DARK);

export function ThemeProvider({ children, forceMode }: { children: ReactNode; forceMode?: 'dark' | 'light' }) {
  const system = useColorScheme();
  const theme = useMemo(() => {
    const mode = forceMode ?? (system === 'light' ? 'light' : 'dark');
    return mode === 'light' ? LD_LIGHT : LD_DARK;
  }, [system, forceMode]);

  return <ThemeCtx.Provider value={theme}>{children}</ThemeCtx.Provider>;
}

export const useLD = () => useContext(ThemeCtx);
