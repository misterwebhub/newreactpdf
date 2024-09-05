import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import { TextField, Divider } from "@mui/material";

export const CustomInputLabel = styled(InputLabel)(({ theme }) => ({
  color: "#ffb942", // Change this to your desired color
  "&.Mui-focused": {
    color: "#ffb942", // Change this to your desired color when focused
  },

  "&.Mui-error": {
    color: "red", // Change this to your desired color when there's an error
  },
}));

export const CustomMenuItem = styled(MenuItem)(({ theme }) => ({
  background: "#292829",
  color: "#ffb942 !important",
}));

export const CustomSelect = styled(Select)(({ theme }) => ({
  color: "#ffb942", // Change text color
  backgroundColor: "#292829", // Set background color to transparent
  "& .MuiSelect-icon": {
    color: "#ffb942", // Change arrow icon color
  },
  "&:hover": {
    backgroundColor: "rgba(41, 40, 41, 0.1)", // Customize hover background color
  },
  "&:focus": {
    backgroundColor: "#ffb942", // Customize focus background color
  },
  "&:focus .MuiSelect-icon": {
    color: "#ffb942", // Change arrow icon color on focus
  },

  "&:before": {
    borderColor: "#ffb942", // Change underline color before selection
  },
  "&:after": {
    borderColor: "#ffb942", // Change underline color after selection
  },
  "&:hover:not(.Mui-disabled):before": {
    borderColor: "#ffb942", // Change underline color on hover
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#ffb942", // Change to your desired golden color
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#ffb942", // Change to your desired color on hover
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#ffb942", // Change to your desired color when focused
  },
}));

export const CustomTextField = styled(TextField)(({ theme }) => ({
  color: "#ffb942 !important",
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#ffb942", // Border color
    },
    "&:hover fieldset": {
      borderColor: "#ffb942", // Border color on hover
    },
    "&.Mui-focused fieldset": {
      borderColor: "#ffb942", // Border color when focused
    },
  },
  "& .MuiInputLabel-root": {
    color: "#ffb942 !important", // Text color
  },
}));

export const CustomDivider = () => {
  return (
    <Divider
      sx={{
        width: "100%",
        backgroundColor: "#ffb942",
        borderWidth: "2.1px",
        mt: 3.51,
        mb: 3.51,
      }}
    />
  );
};
