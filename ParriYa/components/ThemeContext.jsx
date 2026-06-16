import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PropTypes from 'prop-types';
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

  const toggleTheme = useCallback(async () => {
    try {
      const nextValue = !isDarkMode;
      setIsDarkMode(nextValue);
      await AsyncStorage.setItem("theme", nextValue ? "dark" : "light");
    } catch (e) {
      // ignore
    }
  }, [isDarkMode]);

  const colors = useMemo(() => ({
    background: isDarkMode ? COLORS.backgroundDark : COLORS.backgroundLight,
    card: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
    box: isDarkMode ? COLORS.boxDark : COLORS.boxLight,
    text: isDarkMode ? COLORS.textMainDark : COLORS.textMainLight,
    textMuted: isDarkMode ? COLORS.textMutedDark : COLORS.textMutedLight,
    border: isDarkMode ? COLORS.borderDarkMode : COLORS.borderLightMode,
    divider: isDarkMode ? COLORS.dividerDarkMode : COLORS.dividerLightMode,
    dropdownRow: isDarkMode ? "#444444" : "#F2F2F7",
  }), [isDarkMode]);

  const providerValue = useMemo(() => ({ isDarkMode, toggleTheme, colors }), [isDarkMode, toggleTheme, colors]);

  return (
    <ThemeContext.Provider value={providerValue}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useTheme = () => useContext(ThemeContext);
