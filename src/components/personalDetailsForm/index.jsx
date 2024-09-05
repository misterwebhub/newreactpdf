import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ThemeProvider, createTheme } from "@mui/material";
import Cookies from "js-cookie"; // Import js-cookie
import dayjs from "dayjs";

import { CustomInputLabel, CustomMenuItem, CustomSelect, CustomTextField } from "../Fields";

const PersonalDetailForm = ({ onNext, saveFormData, onBack }) => {
  const customTheme = createTheme({
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

  const formik = useFormik({
    initialValues: {
      name: "",
      lastname: "",
      phone: "",
      // contactNumber: "",
      dateOfBirth: null, // Use null for dateOfBirth
      gender: "",
      address: "",
      maritalStatus: "",
      // nationality: "",
      city: "Singapore",
      state: "Singapore",
      postalCode: "",
      email: "",
      address2: "",
      country: "Singapore",
      nationality: "Singapore",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      lastname: Yup.string().required("Name is required"),
      phone: Yup.string().required("Name is required"),
      // contactNumber: Yup.string().required("Contact Number is required"),
      dateOfBirth: Yup.date().nullable().required("Date of Birth is required"), // Use Yup.date() for dateOfBirth
      gender: Yup.string().required("Gender is required"),
      address: Yup.string().required("Address is required"),
      maritalStatus: Yup.string().required("Marital Status is required"),
      nationality: Yup.string().required("Nationality is required"),
      email: Yup.string().email("Invalid email format").required("Email is required"), // Email field with validation
      // city: Yup.string().required("City/Town is required"), // New field validation
      // state: Yup.string().required("State/Region/Province is required"), // New field validation
      postalCode: Yup.number().typeError("Please enter a valid number").required("Postal Code/Zip Code is required"),
    }),
    onSubmit: (values) => {
      
      onNext();
    },
  });

  useEffect(() => {
    // Cookies.remove("personalFormData");
    const formDataFromCookies = Cookies.get("personalFormData"); // Get the saved form data

    if (formDataFromCookies) {
      const parsedData = JSON.parse(formDataFromCookies);
      formik.setValues(parsedData); // Set the formik values from the cookie data
    }
  }, []);

  // Function to save form data to cookies whenever a field changes
  const handleFieldChange = async (fieldName, value) => {
    const updatedValues = { ...formik.values, [fieldName]: value };
    await formik.setValues(updatedValues); // Update formik values

    setTimeout(() => {
      Cookies.set("personalFormData", JSON.stringify(updatedValues), {
        expires: 7,
      }); // Save the form data to cookies as JSON
    }, 100);
  };

  return (
    <form onSubmit={formik.handleSubmit} noValidate >
      <Typography variant='h4' sx={{ color: "#ffb942", mb: 2.51 }}>
        Personal Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <CustomTextField
            fullWidth
            name="email"
            label="Email"
            value={formik.values.email}
            onChange={(e) => {
              formik.handleChange(e);
              handleFieldChange("email", e.target.value);
            }}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            required
            InputProps={{
              style: { color: "#ffb942" },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <CustomTextField
            fullWidth
            name="name"
            label="First Name"
            value={formik.values.name}
            onChange={(e) => {
              formik.handleChange(e);
              handleFieldChange("name", e.target.value);
            }}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            required
            InputProps={{
              style: { color: "#ffb942" },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <CustomTextField
            fullWidth
            name="lastname"
            label="Last Name"
            value={formik.values.lastname}
            onChange={(e) => {
              formik.handleChange(e);
              handleFieldChange("lastname", e.target.value);
            }}
            error={formik.touched.lastname && Boolean(formik.errors.lastname)}
            helperText={formik.touched.lastname && formik.errors.lastname}
            required
            InputProps={{
              style: { color: "#ffb942" },
            }}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <ThemeProvider theme={customTheme}>
            <DatePicker
              fullWidth
              format="DD/MM/YYYY"
              sx={{
                width: "100%",
                "& .MuiPickersLayout-root": {
                  backgroundColor: "black !important", // Set the background color of the popover to black
                  color: "goldenrod !important", // Set the text color of the popover to goldenrod
                },
              }}
              name="dateOfBirth"
              label="Date of Birth"
              value={formik.values.dateOfBirth != null ? dayjs(formik.values.dateOfBirth) : null}
              onChange={(date) => {
                formik.setFieldValue("dateOfBirth", date.toDate());
                handleFieldChange("dateOfBirth", date.toDate());
              }}
              PopOverProps={{
                style: { backgroundColor: "black !important" }, // Set the background color of the popover to black
              }}
              renderInput={(params) => (
                <CustomTextField
                  fullWidth
                  {...params}
                  error={formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)}
                  helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
                  required
                  InputProps={{
                    style: { color: "#ffb942" }, // Change text color to golden
                  }}
                />
              )}
            />
          </ThemeProvider>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth required error={formik.touched.gender && Boolean(formik.errors.gender)}>
            <CustomInputLabel>Gender</CustomInputLabel>
            <CustomSelect
              name="gender"
              label="Gender"
              value={formik.values.gender}
              onChange={(e) => {
                formik.handleChange(e);
                handleFieldChange("gender", e.target.value);
              }}
              MenuProps={{
                PaperProps: {
                  style: { background: "#292829" },
                },
              }}
            >
              <CustomMenuItem value="Male">Male</CustomMenuItem>
              <CustomMenuItem value="Female">Female</CustomMenuItem>
              <CustomMenuItem value="Other">Other</CustomMenuItem>
            </CustomSelect>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <CustomTextField
            fullWidth
            name="address"
            label="Address"
            value={formik.values.address}
            onChange={(e) => {
              formik.handleChange(e);
              handleFieldChange("address", e.target.value);
            }}
            error={formik.touched.address && Boolean(formik.errors.address)}
            helperText={formik.touched.address && formik.errors.address}
            required
            InputProps={{
              style: { color: "#ffb942" },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required error={formik.touched.maritalStatus && Boolean(formik.errors.maritalStatus)}>
            <CustomInputLabel>Marital Status</CustomInputLabel>
            <CustomSelect
              name="maritalStatus"
              label="Marital Status"
              value={formik.values.maritalStatus}
              onChange={(e) => {
                formik.handleChange(e);
                handleFieldChange("maritalStatus", e.target.value);
              }}
              error={formik.touched.maritalStatus && Boolean(formik.errors.maritalStatus)}
              helperText={formik.touched.maritalStatus && formik.errors.maritalStatus}
              MenuProps={{
                PaperProps: {
                  style: { background: "#292829" },
                },
              }}
            >
              <CustomMenuItem value="Married">Married</CustomMenuItem>
              <CustomMenuItem value="Single">Single</CustomMenuItem>
            </CustomSelect>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            name="nationality"
            label="Nationality"
            value={formik.values.nationality}
            onChange={(e) => {
              formik.handleChange(e);
              handleFieldChange("nationality", e.target.value);
            }}
            error={formik.touched.nationality && Boolean(formik.errors.nationality)}
            helperText={formik.touched.nationality && formik.errors.nationality}
            required
            InputProps={{
              style: { color: "#ffb942" },
            }}
          />
        </Grid>
        {/* <Grid item xs={12} sm={4}>
          <CustomTextField
            fullWidth
            name="city"
            label="City/Town"
            value={formik.values.city}
            onChange={(e) => {
              formik.handleChange(e);
              handleFieldChange("city", e.target.value);
            }}
            error={formik.touched.city && Boolean(formik.errors.city)}
            helperText={formik.touched.city && formik.errors.city}
            required
            InputProps={{
              style: { color: "#ffb942" },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <CustomTextField
            fullWidth
            name="state"
            label="State/Region/Province"
            value={formik.values.state}
            onChange={(e) => {
              formik.handleChange(e);
              handleFieldChange("state", e.target.value);
            }}
            error={formik.touched.state && Boolean(formik.errors.state)}
            helperText={formik.touched.state && formik.errors.state}
            required
            InputProps={{
              style: { color: "#ffb942" },
            }}
          />
        </Grid> */}
        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            name="postalCode"
            label="Postal Code/Zip Code"
            type="number"
            value={formik.values.postalCode}
            onChange={(e) => {
              formik.handleChange(e);
              handleFieldChange("postalCode", e.target.value);
            }}
            error={formik.touched.postalCode && Boolean(formik.errors.postalCode)}
            helperText={formik.touched.postalCode && formik.errors.postalCode}
            required
            InputProps={{
              style: { color: "#ffb942" },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            name="phone"
            label="Phone Number"
            // type="number"
            value={formik.values.phone}
            onChange={(e) => {
              formik.handleChange(e);
              handleFieldChange("phone", e.target.value);
            }}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
            required
            InputProps={{
              style: { color: "#ffb942" },
            }}
          />
        </Grid>
      </Grid>
      <Box display="flex" justifyContent="center">
        <Button
          onClick={onBack}
          variant="contained"
          sx={{
            mt: 3.5, // Set margin-top
            mr: 1,
            backgroundColor: "#ffb942", // Set the background color to golden
            "&:hover": {
              backgroundColor: "#ffcc00", // Change background color on hover
            },
          }}
        >
          Back
        </Button>
        <Button
          type="submit"
          variant="contained"
          sx={{
            mt: 3.5, // Set margin-top
            backgroundColor: "#ffb942", // Set the background color to golden
            "&:hover": {
              backgroundColor: "#ffcc00", // Change background color on hover
            },
          }}
        >
          Next
        </Button>
      </Box>
    </form>
  );
};

export default PersonalDetailForm;
