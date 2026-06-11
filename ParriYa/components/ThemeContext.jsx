import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../constants/colors";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    async function loadTheme() {
      try {
        const stored = await AsyncStorage.getItem("theme");
        if (stored) {
          setIsDarkMode(stored === "dark");
        }
      } catch (e) {
        // ignore
      }
    }
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    try {
      const nextValue = !isDarkMode;
      setIsDarkMode(nextValue);
      await AsyncStorage.setItem("theme", nextValue ? "dark" : "light");
    } catch (e) {
      // ignore
    }
  };

  const colors = {
    background: isDarkMode ? COLORS.backgroundDark : COLORS.backgroundLight,
    card: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
    box: isDarkMode ? COLORS.boxDark : COLORS.boxLight,
    text: isDarkMode ? COLORS.textMainDark : COLORS.textMainLight,
    textMuted: isDarkMode ? COLORS.textMutedDark : COLORS.textMutedLight,
    border: isDarkMode ? COLORS.borderDarkMode : COLORS.borderLightMode,
    divider: isDarkMode ? COLORS.dividerDarkMode : COLORS.dividerLightMode,
    dropdownRow: isDarkMode ? "#444444" : "#F2F2F7",
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
