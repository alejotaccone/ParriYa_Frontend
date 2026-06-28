import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PropTypes from 'prop-types';
import { COLORS } from "../constants/colors";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [textSize, setTextSize] = useState("normal"); // "chico" | "normal" | "grande"

  useEffect(() => {
    async function loadSettings() {
      try {
        const storedTheme = await AsyncStorage.getItem("theme");
        const storedTextSize = await AsyncStorage.getItem("textSize");
        if (storedTheme) {
          setIsDarkMode(storedTheme === "dark");
        }
        if (storedTextSize) {
          setTextSize(storedTextSize);
        }
      } catch (e) {
        // ignore
      }
    }
    loadSettings();
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

  const changeTextSize = useCallback(async (newSize) => {
    try {
      setTextSize(newSize);
      await AsyncStorage.setItem("textSize", newSize);
    } catch (e) {
      // ignore
    }
  }, []);

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

  const fontSizeMultiplier = useMemo(() => {
    let multiplier = 1.0;
    if (textSize === "chico") multiplier = 0.85;
    else if (textSize === "grande") multiplier = 1.2;

    if (typeof global !== 'undefined') {
      global.fontSizeMultiplier = multiplier;
    }
    return multiplier;
  }, [textSize]);

  const providerValue = useMemo(() => ({ 
    isDarkMode, 
    toggleTheme, 
    textSize, 
    changeTextSize, 
    fontSizeMultiplier,
    colors 
  }), [isDarkMode, toggleTheme, textSize, changeTextSize, fontSizeMultiplier, colors]);

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
