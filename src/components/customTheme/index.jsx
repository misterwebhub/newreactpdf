import { createTheme } from "@mui/material";

export const customTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ffb942", // Set the primary color to golden
    },
    background: {
      default: "black !important", // Set the background color to black
    },
    text: {
      primary: "#ffb942", // Set the text color to golden
      secondary: "#ffb942",
    },
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: "#ffb942", // Set the text color to golden for input base
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderColor: "#ffb942 !important", // Set the border color to #ffb942
        },
        notchedOutline: {
          borderColor: "#ffb942 !important", // Set the border color to #ffb942
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#ffb942 !important", // Set the icon color to #ffb942
        },
      },
    },
    MuiPickersDay: {
      styleOverrides: {
        daySelected: {
          backgroundColor: "#ffb942 !important", // Set the background color for selected days to #ffb942
          "&:hover": {
            backgroundColor: "#ffb942 !important", // Set the background color on hover to #ffb942
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        paper: {
          background: "#ffb942 !important", // Set the background color of the popover to black
          color: "#ffb942 !important", // Set the text color of the popover to #ffb942
        },
      },
    },

    MuiPopper: {
      styleOverrides: {
        paper: {
          background: "#ffb942 !important", // Set the background color of the popover to black
          color: "#ffb942 !important", // Set the text color of the popover to #ffb942
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#ffb942 !important", // Set the text color to #ffb942 for input labels
        },
      },
    },
  },
});
