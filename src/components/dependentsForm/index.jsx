import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Typography, Button, Grid, Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ThemeProvider, createTheme, FormControl } from "@mui/material";
import {
  CustomTextField,
  CustomInputLabel,
  CustomSelect,
  CustomMenuItem,
} from "../Fields";
import Cookies from "js-cookie";
import dayjs from "dayjs";

const DependentForm = ({ onNext, onBack }) => {
  const [dependentsCount, setDependentsCount] = useState([0]);

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
      anyDependents: "Yes",
      noOfChild: "0",
      dependents: dependentsCount.map(() => ({
        dependentName: "",
        dependentDateBirth: null,
        dependentAnnualSpending: "",
        years: "",
      })),
    },
    validationSchema: Yup.object().shape({
      anyDependents: Yup.string(),
      noOfChild: Yup.number().min(0, "Amount must be 0 or positive"),
      dependents: Yup.array().of(
        Yup.object().shape({
          dependentName: Yup.string().optional(),
          dependentDateBirth: Yup.date().nullable().optional(),
          dependentAnnualSpending: Yup.number()
            .optional()
            .positive("Amount must be positive"),
          years: Yup.number().optional().positive("Amount must be positive"),
        })
      ),
    }),
    onSubmit: (values) => {
      // Save form data to cookies
      Cookies.set("dependentsFormData", JSON.stringify(values), {
        expires: 7,
      });
      onNext();
    },
  });

  // Load saved form data from cookies
  useEffect(() => {
    // Cookies.remove("dependentsFormData");
    const formDataFromCookies = Cookies.get("dependentsFormData");
    if (formDataFromCookies) {
      const parsedData = JSON.parse(formDataFromCookies);
      formik.setValues(parsedData);

      let arr = [0];

      for (
        let index = 0;
        index < parsedData["dependents"].length - 1;
        index++
      ) {
        handleAddGoal("dependents");
        arr.push(index + 1);
      }

      setDependentsCount(arr);
    }
  }, []);

  const handleFieldChange = async (fieldName, value, goalType, index) => {
    const updatedValues = { ...formik.values };
    updatedValues[goalType][index][fieldName] = value;

    await formik.setValues(updatedValues);
    setTimeout(() => {
      Cookies.set("dependentsFormData", JSON.stringify(updatedValues), {
        expires: 7,
      });
    }, 100);
  };

  const handleFieldChangeSimple = async (fieldName, value) => {
    const updatedValues = { ...formik.values, [fieldName]: value };
    await formik.setValues(updatedValues); // Update formik values

    setTimeout(() => {
      Cookies.set("dependentsFormData", JSON.stringify(updatedValues), {
        expires: 7,
      }); // Save the form data to cookies as JSON
    }, 100);
  };

  const handleAddGoal = (type) => {
    if (type === "dependents" && dependentsCount.length < 4) {
      const newGoal = {
        dependentName: "",
        dependentDateBirth: "",
        dependentAnnualSpending: "",
        years: "",
      };

      setDependentsCount((prevCounts) => [...prevCounts, prevCounts.length]);

      const formDataFromCookies = Cookies.get("dependentsFormData");
      if (
        formDataFromCookies &&
        JSON.parse(formDataFromCookies)[type][formik.values[type].length] !=
          undefined
      ) {
        const parsedData = JSON.parse(formDataFromCookies);
        formik.setValues(parsedData);
      } else {
        formik.setFieldValue(type, [...formik.values[type], newGoal]);
      }
    }
  };

  const handleRemoveGoal = (type, index) => {
    const goals = [...formik.values[type]];
    goals.splice(index, 1);
    formik.setFieldValue(type, goals);

    const formDataFromCookies = Cookies.get("dependentsFormData");
    if (formDataFromCookies) {
      const parsedData = JSON.parse(formDataFromCookies);
      if (parsedData[type]) {
        parsedData[type].splice(index, 1);
        setTimeout(() => {
          Cookies.set("dependentsFormData", JSON.stringify(parsedData), {
            expires: 7,
          });
        }, 101);
        formik.setValues(parsedData);
      }
    }

    if (type === "dependents") {
      let temp = [];

      dependentsCount.map((d) => {
        if (d !== index) {
          if (d > index) {
            temp.push(d - 1);
          } else {
            temp.push(d);
          }
        }
      });

      setDependentsCount(temp);
    }
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Typography variant="h4" sx={{ color: "#ffb942" }}>
        Dependents
      </Typography>

      <Grid container spacing={2} mt={0.5}>
        <Grid item xs={12} sm={12}>
          <FormControl
            fullWidth
            required
            error={
              formik.touched.anyDependents &&
              Boolean(formik.errors.anyDependents)
            }
          >
            <CustomInputLabel>Any Dependents?</CustomInputLabel>
            <CustomSelect
              name="anyDependents"
              label="Any Dependents"
              value={formik.values.anyDependents}
              onChange={(e) => {
                formik.handleChange(e);
                handleFieldChangeSimple("anyDependents", e.target.value);
              }}
              error={
                formik.touched.anyDependents &&
                Boolean(formik.errors.anyDependents)
              }
              helperText={
                formik.touched.anyDependents && formik.errors.anyDependents
              }
              MenuProps={{
                PaperProps: {
                  style: { background: "#292829" },
                },
              }}
            >
              <CustomMenuItem value="Yes">Yes</CustomMenuItem>
              <CustomMenuItem value="No">No</CustomMenuItem>
            </CustomSelect>
          </FormControl>
        </Grid>
      </Grid>
      {formik.values.anyDependents === "No" && (
        <Grid item xs={12} sm={12} mt={2.51}>
          <CustomTextField
            fullWidth
            name={"noOfChild"}
            label="How many children would you like in the future?"
            type="number"
            value={formik.values.noOfChild}
            onChange={(e) => {
              formik.handleChange(e);
              handleFieldChangeSimple("noOfChild", e.target.value);
            }}
            error={formik.touched.noOfChild && Boolean(formik.errors.noOfChild)}
            helperText={formik.touched.noOfChild && formik.errors.noOfChild}
            InputProps={{
              style: { color: "#ffb942" },
            }}
          />
        </Grid>
      )}
      {formik.values.anyDependents === "Yes" &&
        dependentsCount.map((index) => {
          return (
            <Grid container spacing={2} key={index} mt={0.5}>
              <Grid item xs={12} sm={2}>
                <CustomTextField
                  fullWidth
                  name={`dependents[${index}].dependentName`}
                  label="Name"
                  value={formik.values.dependents[index].dependentName}
                  onChange={(e) =>
                    handleFieldChange(
                      "dependentName",
                      e.target.value,
                      "dependents",
                      index
                    )
                  }
                  error={
                    formik.touched.dependents &&
                    formik.touched.dependents[index] &&
                    Boolean(
                      formik.errors.dependents &&
                        formik.errors.dependents[index]?.dependentName
                    )
                  }
                  helperText={
                    formik.touched.dependents &&
                    formik.touched.dependents[index] &&
                    formik.errors.dependents &&
                    formik.errors.dependents[index]?.dependentName
                  }
                  InputProps={{
                    style: { color: "#ffb942" },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <ThemeProvider theme={customTheme}>
                  <DatePicker
                    fullWidth
                    sx={{
                      width: "100%",
                      "& .MuiPickersLayout-root": {
                        backgroundColor: "black !important", // Set the background color of the popover to black
                        color: "goldenrod !important", // Set the text color of the popover to goldenrod
                      },
                    }}
                    name={`dependents[${index}].dependentDateBirth`}
                    label="Date of Birth"
                    value={
                      formik.values.dependents[index].dependentDateBirth != null
                        ? dayjs(
                            formik.values.dependents[index].dependentDateBirth
                          )
                        : null
                    }
                    onChange={(date) =>
                      handleFieldChange(
                        "dependentDateBirth",
                        date.toDate(),
                        "dependents",
                        index
                      )
                    }
                    PopOverProps={{
                      style: { backgroundColor: "black !important" }, // Set the background color of the popover to black
                    }}
                    renderInput={(params) => (
                      <CustomTextField
                        fullWidth
                        {...params}
                        error={
                          formik.touched.dateOfBirth &&
                          Boolean(formik.errors.dateOfBirth)
                        }
                        helperText={
                          formik.touched.dateOfBirth &&
                          formik.errors.dateOfBirth
                        }
                        required
                        InputProps={{
                          style: { color: "#ffb942" }, // Change text color to golden
                        }}
                      />
                    )}
                  />
                </ThemeProvider>
              </Grid>
              <Grid item xs={12} sm={2}>
                <CustomTextField
                  fullWidth
                  name={`dependents[${index}].dependentAnnualSpending`}
                  label="Estimated Annual Spending"
                  type="number"
                  value={
                    formik.values.dependents[index].dependentAnnualSpending
                  }
                  onChange={(e) =>
                    handleFieldChange(
                      "dependentAnnualSpending",
                      e.target.value,
                      "dependents",
                      index
                    )
                  }
                  error={
                    formik.touched.dependents &&
                    formik.touched.dependents[index] &&
                    Boolean(
                      formik.errors.dependents &&
                        formik.errors.dependents[index]?.dependentAnnualSpending
                    )
                  }
                  helperText={
                    formik.touched.dependents &&
                    formik.touched.dependents[index] &&
                    formik.errors.dependents &&
                    formik.errors.dependents[index]?.dependentAnnualSpending
                  }
                  InputProps={{
                    style: { color: "#ffb942" },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <CustomTextField
                  fullWidth
                  name={`dependents[${index}].years`}
                  label="For How Many More Years"
                  type="number"
                  value={formik.values.dependents[index].years}
                  onChange={(e) =>
                    handleFieldChange(
                      "years",
                      e.target.value,
                      "dependents",
                      index
                    )
                  }
                  error={
                    formik.touched.dependents &&
                    formik.touched.dependents[index] &&
                    Boolean(
                      formik.errors.dependents &&
                        formik.errors.dependents[index]?.years
                    )
                  }
                  helperText={
                    formik.touched.dependents &&
                    formik.touched.dependents[index] &&
                    formik.errors.dependents &&
                    formik.errors.dependents[index]?.years
                  }
                  InputProps={{
                    style: { color: "#ffb942" },
                  }}
                />
              </Grid>
              {index > 0 && (
                <Grid item xs={12} sm={1}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => handleRemoveGoal("dependents", index)}
                      sx={{
                        mt: 1,
                        backgroundColor: "#ffb942",
                        "&:hover": {
                          backgroundColor: "#ffcc00",
                        },
                      }}
                    >
                      Remove
                    </Button>
                  </Box>
                </Grid>
              )}
            </Grid>
          );
        })}
      {formik.values.anyDependents === "Yes" && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {" "}
          <Button
            variant="contained"
            onClick={() => handleAddGoal("dependents")}
            sx={{
              mt: 1.5,
              backgroundColor: "#ffb942",
              "&:hover": {
                backgroundColor: "#ffcc00",
              },
            }}
          >
            Add Dependent
          </Button>
        </Box>
      )}
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

export default DependentForm;
