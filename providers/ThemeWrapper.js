"use client";

import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#000000", paper: "#0a0a0a" },
    text: { primary: "#ffffff", secondary: "rgba(255,255,255,0.6)" },
    divider: "rgba(255,255,255,0.12)",
    primary: { main: "#ffffff" },
    secondary: { main: "#ffffff" },
  },
  shape: { borderRadius: 12 },
  typography: { fontSize: 14, button: { textTransform: "none", fontWeight: 600 } },
  components: {
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255,255,255,0.2)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255,255,255,0.35)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#fff",
          },
        },
      },
    },

    MuiInputBase: {
      styleOverrides: {
        input: {
          "&:focus": {
            outline: "none",
            boxShadow: "none", // Remove glow
          },
        },
      },
    },

    MuiCssBaseline: {
      styleOverrides: {
        "::selection": {
          backgroundColor: "rgba(255,255,255,0.2)",
          color: "#fff",
        },
      },
    },
  },
});

export default function ThemeWrapper({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
