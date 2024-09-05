import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import { Box } from "@mui/material";
import Cookies from "js-cookie"; // Import js-cookie
import {
  CustomInputLabel,
  CustomMenuItem,
  CustomSelect,
  CustomTextField,
} from "../Fields";

const EmploymentStatusForm = ({ onNext, onBack }) => {
  const formik = useFormik({
    initialValues: {
      status: "", // Status options: "Student", "Full Time", "Self-Employed/Freelancer", "Part Time"
      occupation: "",
      company: "",
      yearsInCompany: "",
    },
    validationSchema: Yup.object({
      status: Yup.string().required("Status is required"),
      occupation: Yup.string().required("Occupation is required"),
      company: Yup.string().required("Company is required"),
      yearsInCompany: Yup.number()
        .typeError("Please enter a valid number")
        .required("Years in Company is required")
        .positive("Years in Company must be a positive number")
        .integer("Years in Company must be a whole number"),
    }),
    onSubmit: (values) => {
      console.log("Employment Status Form Values", values);
      onNext();
    },
  });

  useEffect(() => {
    // Cookies.remove("personalFormData");
    const formDataFromCookies = Cookies.get("employmentStatusFormData"); // Get the saved form data

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
      Cookies.set("employmentStatusFormData", JSON.stringify(updatedValues), {
        expires: 7,
      }); // Save the form data to cookies as JSON
    }, 100);
  };

  return (
    <form onSubmit={formik.handleSubmit} noValidate>
      <Typography variant="h4" sx={{ color: "#ffb942", mb: 2.51 }}>
        Employment
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            required
            error={formik.touched.status && Boolean(formik.errors.status)}
          >
            <CustomInputLabel>Status</CustomInputLabel>
            <CustomSelect
              name="status"
              label="Status"
              value={formik.values.status}
              onChange={(e) => {
                formik.handleChange(e);
                handleFieldChange("status", e.target.value);
              }}
              MenuProps={{
                PaperProps: {
                  style: { background: "#292829" },
                },
              }}
            >
              <CustomMenuItem value="Student">Student</CustomMenuItem>
              <CustomMenuItem value="Full Time">Full Time</CustomMenuItem>
              <CustomMenuItem value="Self-Employed/Freelancer">
                Self-Employed/Freelancer
              </CustomMenuItem>
              <CustomMenuItem value="Part Time">Part Time</CustomMenuItem>
              <CustomMenuItem value="Retired">Retired</CustomMenuItem>
              <CustomMenuItem value="Unemployed">Unemployed</CustomMenuItem>
            </CustomSelect>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <CustomTextField
            fullWidth
            name="occupation"
            label="Occupation"
            value={formik.values.occupation}
            onChange={(e) => {
              formik.handleChange(e);
              handleFieldChange("occupation", e.target.value);
            }}
            error={
              formik.touched.occupation && Boolean(formik.errors.occupation)
            }
            helperText={formik.touched.occupation && formik.errors.occupation}
            required
            InputProps={{
              style: { color: "#ffb942" },
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomTextField
            fullWidth
            name="company"
            label="Company"
            value={formik.values.company}
            onChange={(e) => {
              formik.handleChange(e);
              handleFieldChange("company", e.target.value);
            }}
            error={formik.touched.company && Boolean(formik.errors.company)}
            helperText={formik.touched.company && formik.errors.company}
            required
            InputProps={{
              style: { color: "#ffb942" },
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomTextField
            fullWidth
            name="yearsInCompany"
            label="Years in Company"
            type="number"
            value={formik.values.yearsInCompany}
            onChange={(e) => {
              formik.handleChange(e);
              handleFieldChange("yearsInCompany", e.target.value);
            }}
            error={
              formik.touched.yearsInCompany &&
              Boolean(formik.errors.yearsInCompany)
            }
            helperText={
              formik.touched.yearsInCompany && formik.errors.yearsInCompany
            }
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
            mt: 3.5,
            mr: 1,
            backgroundColor: "#ffb942",
            "&:hover": {
              backgroundColor: "#ffcc00",
            },
          }}
        >
          Back
        </Button>
        <Button
          type="submit"
          variant="contained"
          sx={{
            mt: 3.5,
            backgroundColor: "#ffb942",
            "&:hover": {
              backgroundColor: "#ffcc00",
            },
          }}
        >
          Next
        </Button>
      </Box>
    </form>
  );
};

export default EmploymentStatusForm;
