// theme/ThemeProvider.tsx
import { observer } from "mobx-react-lite";
import { createContext, ReactNode, useContext } from "react";
import { ColorSchemeName, useColorScheme } from "react-native";
import { useStore } from "../store/StoreProvider";

export type ThemeMode = "light" | "dark" | "system";

type ThemeContextType = {
  theme: ColorSchemeName;
  setTheme: (mode: ThemeMode) => Promise<void>;
  themeMode: ThemeMode;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = observer(({ children }: ThemeProviderProps) => {
  const { settingsStore } = useStore();
  const { theme, setSettingsTheme } = settingsStore;
  const systemTheme = useColorScheme();

  // activeTheme resolves 'system' to actual color scheme
  const activeTheme: ColorSchemeName = theme === "system" ? systemTheme : theme;
  const setTheme = async (mode: ThemeMode): Promise<void> => {
    await setSettingsTheme(mode);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: activeTheme,
        setTheme,
        themeMode: settingsStore.theme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
});

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
