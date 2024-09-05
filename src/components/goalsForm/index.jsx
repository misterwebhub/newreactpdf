import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Typography, Button, Grid, Box, ThemeProvider } from "@mui/material";
import { CustomTextField, CustomDivider } from "../Fields"; // You can customize this import as needed
import Cookies from "js-cookie";
import AddIcon from "@mui/icons-material/Add";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { customTheme } from "../customTheme";

const GoalForm = ({ onNext, onBack }) => {
  const [shortTermGoalsCount, setShortTermGoalsCount] = useState([0]);
  const [midTermGoalsCount, setMidTermGoalsCount] = useState([0]);
  const [longTermGoalsCount, setLongTermGoalsCount] = useState([0]);

  const today = dayjs((dayjs().format('YYYY-MM-DD')));
  const minShort = dayjs(today).add(1, "year");
  const maxShort = dayjs(today).add(3, "year");
  const minMid = dayjs(today).add(3, "year");
  const maxMid = dayjs(today).add(10, "year");
  const minLong = dayjs(today).add(10, "year");


  const formik = useFormik({
    initialValues: {
      shortTermGoals: shortTermGoalsCount.map(() => ({
        description: "",
        targetDate: "",
        amount: "",
      })),
      midTermGoals: midTermGoalsCount.map(() => ({
        description: "",
        targetDate: "",
        amount: "",
      })),
      longTermGoals: longTermGoalsCount.map(() => ({
        description: "",
        targetDate: "",
        amount: "",
      })),
    },
    validationSchema: Yup.object().shape({
      shortTermGoals: Yup.array().of(
        Yup.object().shape({
          description: Yup.string().required("Description is required"),
          targetDate: Yup.string().required("Target date is required"),
          amount: Yup.number()
            .required("Amount is required")
            .positive("Amount must be positive"),
        })
      ),
      midTermGoals: Yup.array().of(
        Yup.object().shape({
          description: Yup.string().required("Description is required"),
          targetDate: Yup.string().required("Target date is required"),
          amount: Yup.number()
            .required("Amount is required")
            .positive("Amount must be positive"),
        })
      ),
      longTermGoals: Yup.array().of(
        Yup.object().shape({
          description: Yup.string().required("Description is required"),
          targetDate: Yup.string().required("Target date is required"),
          amount: Yup.number()
            .required("Amount is required")
            .positive("Amount must be positive"),
        })
      ),
    }),
    onSubmit: (values) => {
      // Save form data to cookies
      Cookies.set("goalFormData", JSON.stringify(values), {
        expires: 7,
      });
      onNext();
    },
  });

  // Load saved form data from cookies
  useEffect(() => {
    // Cookies.remove("goalFormData");
    const formDataFromCookies = Cookies.get("goalFormData");
    if (formDataFromCookies) {
      const parsedData = JSON.parse(formDataFromCookies);
      formik.setValues(parsedData);

      let arr = [0],
        mid = [0],
        long = [0];

      for (
        let index = 0;
        index < parsedData["shortTermGoals"].length - 1;
        index++
      ) {
        handleAddGoal("shortTermGoals");
        arr.push(index + 1);
      }

      for (
        let index = 0;
        index < parsedData["midTermGoals"].length - 1;
        index++
      ) {
        handleAddGoal("midTermGoals");
        mid.push(index + 1);
      }

      for (
        let index = 0;
        index < parsedData["longTermGoals"].length - 1;
        index++
      ) {
        handleAddGoal("longTermGoals");
        long.push(index + 1);
      }

      setShortTermGoalsCount(arr);
      setMidTermGoalsCount(mid);
      setLongTermGoalsCount(long);
    }
  }, []);

  const handleFieldChange = async (fieldName, value, goalType, index) => {
    const updatedValues = { ...formik.values };
    updatedValues[goalType][index][fieldName] = value;

    await formik.setValues(updatedValues);
    setTimeout(() => {
      Cookies.set("goalFormData", JSON.stringify(updatedValues), {
        expires: 7,
      });
    }, 100);
  };

  const handleAddGoal = (type) => {
    if (type === "shortTermGoals" && shortTermGoalsCount.length < 4) {
      const newGoal = {
        description: "",
        targetDate: "",
        amount: "",
      };

      setShortTermGoalsCount((prevCounts) => [
        ...prevCounts,
        prevCounts.length,
      ]);

      const formDataFromCookies = Cookies.get("goalFormData");
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
    } else if (type === "midTermGoals" && midTermGoalsCount.length < 4) {
      const newGoal = {
        description: "",
        targetDate: "",
        amount: "",
      };

      setMidTermGoalsCount((prevCounts) => [...prevCounts, prevCounts.length]);

      const formDataFromCookies = Cookies.get("goalFormData");
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
    } else if (type === "longTermGoals" && longTermGoalsCount.length < 4) {
      const newGoal = {
        description: "",
        targetDate: "",
        amount: "",
      };

      setLongTermGoalsCount((prevCounts) => [...prevCounts, prevCounts.length]);

      const formDataFromCookies = Cookies.get("goalFormData");
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

    const formDataFromCookies = Cookies.get("goalFormData");
    if (formDataFromCookies) {
      const parsedData = JSON.parse(formDataFromCookies);
      if (parsedData[type]) {
        parsedData[type].splice(index, 1);
        setTimeout(() => {
          Cookies.set("goalFormData", JSON.stringify(parsedData), {
            expires: 7,
          });
        }, 101);
        formik.setValues(parsedData);
      }
    }

    if (type === "shortTermGoals") {
      let temp = [];

      shortTermGoalsCount.map((d) => {
        if (d !== index) {
          if (d > index) {
            temp.push(d - 1);
          } else {
            temp.push(d);
          }
        }
      });

      setShortTermGoalsCount(temp);
    } else if (type === "midTermGoals") {
      let temp = [];

      midTermGoalsCount.map((d) => {
        if (d !== index) {
          if (d > index) {
            temp.push(d - 1);
          } else {
            temp.push(d);
          }
        }
      });

      setMidTermGoalsCount(temp);
    } else if (type === "longTermGoals") {
      let temp = [];

      longTermGoalsCount.map((d) => {
        if (d !== index) {
          if (d > index) {
            temp.push(d - 1);
          } else {
            temp.push(d);
          }
        }
      });

      setLongTermGoalsCount(temp);
    }
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Typography variant="h4" sx={{ color: "#ffb942", mb: 2.51 }}>
        Goal
      </Typography>

      {/* Short-term Goals */}
      <Typography variant="h5" sx={{ color: "#ffb942" }}>
        Short-term Goals (1-3 Years)
      </Typography>
      {shortTermGoalsCount.map((index) => {
        return (
          <Grid container spacing={2} key={index} mt={0.5}>
            <Grid item xs={12} sm={4}>
              <CustomTextField
                fullWidth
                name={`shortTermGoals[${index}].description`}
                label="Description"
                value={formik.values.shortTermGoals[index].description}
                onChange={(e) =>
                  handleFieldChange(
                    "description",
                    e.target.value,
                    "shortTermGoals",
                    index
                  )
                }
                error={
                  formik.touched.shortTermGoals &&
                  formik.touched.shortTermGoals[index] &&
                  Boolean(
                    formik.errors.shortTermGoals &&
                    formik.errors.shortTermGoals[index]?.description
                  )
                }
                helperText={
                  formik.touched.shortTermGoals &&
                  formik.touched.shortTermGoals[index] &&
                  formik.errors.shortTermGoals &&
                  formik.errors.shortTermGoals[index]?.description
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
                  views={["year"]}
                  openTo="year"
                  minDate={minShort}
                  maxDate={maxShort}
                  sx={{
                    width: "100%",
                    "& .MuiPickersLayout-root": {
                      backgroundColor: "black !important", // Set the background color of the popover to black
                      color: "goldenrod !important", // Set the text color of the popover to goldenrod
                    },
                  }}
                  name={`shortTermGoals[${index}].targetDate`}
                  label="Target Date"
                  onChange={(date) =>
                    handleFieldChange(
                      "targetDate",
                      date.toDate(),
                      "shortTermGoals",
                      index
                    )
                  }
                  value={
                    formik.values.shortTermGoals[index].targetDate != null
                      ? dayjs(formik.values.shortTermGoals[index].targetDate)
                      : null
                  }
                  PopOverProps={{
                    style: { backgroundColor: "black !important" }, // Set the background color of the popover to black
                  }}
                  renderInput={(params) => (
                    <CustomTextField
                      fullWidth
                      {...params}
                      error={
                        formik.touched.shortTermGoals &&
                        formik.touched.shortTermGoals[index] &&
                        Boolean(
                          formik.errors.shortTermGoals &&
                          formik.errors.shortTermGoals[index]?.targetDate
                        )
                      }
                      helperText={
                        formik.touched.shortTermGoals &&
                        formik.touched.shortTermGoals[index] &&
                        formik.errors.shortTermGoals &&
                        formik.errors.shortTermGoals[index]?.targetDate
                      }
                      required
                      InputProps={{
                        style: { color: "#ffb942" }, // Change text color to golden
                      }}
                    />
                  )}
                />
              </ThemeProvider>
              {/* <CustomTextField
                fullWidth
                name={`shortTermGoals[${index}].targetDate`}
                label="Target Date"
                value={formik.values.shortTermGoals[index].targetDate}
                onChange={(e) =>
                  handleFieldChange(
                    "targetDate",
                    e.target.value,
                    "shortTermGoals",
                    index
                  )
                }
                error={
                  formik.touched.shortTermGoals &&
                  formik.touched.shortTermGoals[index] &&
                  Boolean(
                    formik.errors.shortTermGoals &&
                      formik.errors.shortTermGoals[index]?.targetDate
                  )
                }
                helperText={
                  formik.touched.shortTermGoals &&
                  formik.touched.shortTermGoals[index] &&
                  formik.errors.shortTermGoals &&
                  formik.errors.shortTermGoals[index]?.targetDate
                }
                InputProps={{
                  style: { color: "#ffb942" },
                }}
              /> */}
            </Grid>
            <Grid item xs={12} sm={3}>
              <CustomTextField
                fullWidth
                name={`shortTermGoals[${index}].amount`}
                label="Amount"
                type="number"
                value={formik.values.shortTermGoals[index].amount}
                onChange={(e) =>
                  handleFieldChange(
                    "amount",
                    e.target.value,
                    "shortTermGoals",
                    index
                  )
                }
                error={
                  formik.touched.shortTermGoals &&
                  formik.touched.shortTermGoals[index] &&
                  Boolean(
                    formik.errors.shortTermGoals &&
                    formik.errors.shortTermGoals[index]?.amount
                  )
                }
                helperText={
                  formik.touched.shortTermGoals &&
                  formik.touched.shortTermGoals[index] &&
                  formik.errors.shortTermGoals &&
                  formik.errors.shortTermGoals[index]?.amount
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
                    onClick={() => handleRemoveGoal("shortTermGoals", index)}
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
          onClick={() => handleAddGoal("shortTermGoals")}
          sx={{
            mt: 1,
            backgroundColor: "#ffb942",
            "&:hover": {
              backgroundColor: "#ffcc00",
            },
          }}
        >
          <AddIcon />
          Add Short-term Goal
        </Button>
      </Box>
      <CustomDivider />
      {/* Mid-term Goals */}
      <Typography variant="h5" sx={{ color: "#ffb942" }}>
        Mid-term Goals (3-10 Years)
      </Typography>
      {midTermGoalsCount.map((index) => (
        <Grid container spacing={2} key={index} mt={0.5}>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name={`midTermGoals[${index}].description`}
              label="Description"
              value={formik.values.midTermGoals[index].description}
              onChange={(e) =>
                handleFieldChange(
                  "description",
                  e.target.value,
                  "midTermGoals",
                  index
                )
              }
              error={
                formik.touched.midTermGoals &&
                formik.touched.midTermGoals[index] &&
                Boolean(
                  formik.errors.midTermGoals &&
                  formik.errors.midTermGoals[index]?.description
                )
              }
              helperText={
                formik.touched.midTermGoals &&
                formik.touched.midTermGoals[index] &&
                formik.errors.midTermGoals &&
                formik.errors.midTermGoals[index]?.description
              }
              InputProps={{
                style: { color: "#ffb942" },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            {/* <CustomTextField
              fullWidth
              name={`midTermGoals[${index}].targetDate`}
              label="Target Date"
              value={formik.values.midTermGoals[index].targetDate}
              onChange={(e) =>
                handleFieldChange(
                  "targetDate",
                  e.target.value,
                  "midTermGoals",
                  index
                )
              }
              error={
                formik.touched.midTermGoals &&
                formik.touched.midTermGoals[index] &&
                Boolean(
                  formik.errors.midTermGoals &&
                    formik.errors.midTermGoals[index]?.targetDate
                )
              }
              helperText={
                formik.touched.midTermGoals &&
                formik.touched.midTermGoals[index] &&
                formik.errors.midTermGoals &&
                formik.errors.midTermGoals[index]?.targetDate
              }
              InputProps={{
                style: { color: "#ffb942" },
              }}
            /> */}
            <ThemeProvider theme={customTheme}>
              <DatePicker
                fullWidth
                views={["year"]}
                openTo="year"
                minDate={minMid}
                maxDate={maxMid}
                sx={{
                  width: "100%",
                  "& .MuiPickersLayout-root": {
                    backgroundColor: "black !important", // Set the background color of the popover to black
                    color: "goldenrod !important", // Set the text color of the popover to goldenrod
                  },
                }}
                name={`midTermGoals[${index}].targetDate`}
                label="Target Date"
                onChange={(date) =>
                  handleFieldChange(
                    "targetDate",
                    date.toDate(),
                    "midTermGoals",
                    index
                  )
                }
                value={
                  formik.values.midTermGoals[index].targetDate != null
                    ? dayjs(formik.values.midTermGoals[index].targetDate)
                    : null
                }
                PopOverProps={{
                  style: { backgroundColor: "black !important" }, // Set the background color of the popover to black
                }}
                renderInput={(params) => (
                  <CustomTextField
                    fullWidth
                    {...params}
                    error={
                      formik.touched.midTermGoals &&
                      formik.touched.midTermGoals[index] &&
                      Boolean(
                        formik.errors.midTermGoals &&
                        formik.errors.midTermGoals[index]?.targetDate
                      )
                    }
                    helperText={
                      formik.touched.midTermGoals &&
                      formik.touched.midTermGoals[index] &&
                      formik.errors.midTermGoals &&
                      formik.errors.midTermGoals[index]?.targetDate
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
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              name={`midTermGoals[${index}].amount`}
              label="Amount"
              type="number"
              value={formik.values.midTermGoals[index].amount}
              onChange={(e) =>
                handleFieldChange(
                  "amount",
                  e.target.value,
                  "midTermGoals",
                  index
                )
              }
              error={
                formik.touched.midTermGoals &&
                formik.touched.midTermGoals[index] &&
                Boolean(
                  formik.errors.midTermGoals &&
                  formik.errors.midTermGoals[index]?.amount
                )
              }
              helperText={
                formik.touched.midTermGoals &&
                formik.touched.midTermGoals[index] &&
                formik.errors.midTermGoals &&
                formik.errors.midTermGoals[index]?.amount
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
                  onClick={() => handleRemoveGoal("midTermGoals", index)}
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
      ))}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          onClick={() => handleAddGoal("midTermGoals")}
          sx={{
            mt: 1,
            backgroundColor: "#ffb942",
            "&:hover": {
              backgroundColor: "#ffcc00",
            },
          }}
        >
          <AddIcon />
          Add Mid-term Goal
        </Button>
      </Box>
      <CustomDivider />
      {/* Long-term Goals */}
      <Typography variant="h5" sx={{ color: "#ffb942" }}>
        Long-term Goals (10+ Years, excluding retirement)
      </Typography>
      {longTermGoalsCount.map((index) => (
        <Grid container spacing={2} key={index} mt={0.5}>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name={`longTermGoals[${index}].description`}
              label="Description"
              value={formik.values.longTermGoals[index].description}
              onChange={(e) =>
                handleFieldChange(
                  "description",
                  e.target.value,
                  "longTermGoals",
                  index
                )
              }
              error={
                formik.touched.longTermGoals &&
                formik.touched.longTermGoals[index] &&
                Boolean(
                  formik.errors.longTermGoals &&
                  formik.errors.longTermGoals[index]?.description
                )
              }
              helperText={
                formik.touched.longTermGoals &&
                formik.touched.longTermGoals[index] &&
                formik.errors.longTermGoals &&
                formik.errors.longTermGoals[index]?.description
              }
              InputProps={{
                style: { color: "#ffb942" },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            {/* <CustomTextField
              fullWidth
              name={`longTermGoals[${index}].targetDate`}
              label="Target Date"
              value={formik.values.longTermGoals[index].targetDate}
              onChange={(e) =>
                handleFieldChange(
                  "targetDate",
                  e.target.value,
                  "longTermGoals",
                  index
                )
              }
              error={
                formik.touched.longTermGoals &&
                formik.touched.longTermGoals[index] &&
                Boolean(
                  formik.errors.longTermGoals &&
                    formik.errors.longTermGoals[index]?.targetDate
                )
              }
              helperText={
                formik.touched.longTermGoals &&
                formik.touched.longTermGoals[index] &&
                formik.errors.longTermGoals &&
                formik.errors.longTermGoals[index]?.targetDate
              }
              InputProps={{
                style: { color: "#ffb942" },
              }}
            /> */}
            <ThemeProvider theme={customTheme}>
              <DatePicker
                fullWidth
                views={["year"]}
                openTo="year"
                minDate={minLong}

                sx={{
                  width: "100%",
                  "& .MuiPickersLayout-root": {
                    backgroundColor: "black !important", // Set the background color of the popover to black
                    color: "goldenrod !important", // Set the text color of the popover to goldenrod
                  },
                }}
                name={`longTermGoals[${index}].targetDate`}
                label="Target Date"
                onChange={(date) =>
                  handleFieldChange(
                    "targetDate",
                    date.toDate(),
                    "longTermGoals",
                    index
                  )
                }
                value={
                  formik.values.longTermGoals[index].targetDate != null
                    ? dayjs(formik.values.longTermGoals[index].targetDate)
                    : null
                }
                PopOverProps={{
                  style: { backgroundColor: "black !important" }, // Set the background color of the popover to black
                }}
                renderInput={(params) => (
                  <CustomTextField
                    fullWidth
                    {...params}
                    error={
                      formik.touched.longTermGoals &&
                      formik.touched.longTermGoals[index] &&
                      Boolean(
                        formik.errors.longTermGoals &&
                        formik.errors.longTermGoals[index]?.targetDate
                      )
                    }
                    helperText={
                      formik.touched.longTermGoals &&
                      formik.touched.longTermGoals[index] &&
                      formik.errors.longTermGoals &&
                      formik.errors.longTermGoals[index]?.targetDate
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
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              name={`longTermGoals[${index}].amount`}
              label="Amount"
              type="number"
              value={formik.values.longTermGoals[index].amount}
              onChange={(e) =>
                handleFieldChange(
                  "amount",
                  e.target.value,
                  "longTermGoals",
                  index
                )
              }
              error={
                formik.touched.longTermGoals &&
                formik.touched.longTermGoals[index] &&
                Boolean(
                  formik.errors.longTermGoals &&
                  formik.errors.longTermGoals[index]?.amount
                )
              }
              helperText={
                formik.touched.longTermGoals &&
                formik.touched.longTermGoals[index] &&
                formik.errors.longTermGoals &&
                formik.errors.longTermGoals[index]?.amount
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
                  color="secondary"
                  onClick={() => handleRemoveGoal("longTermGoals", index)}
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
      ))}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          onClick={() => handleAddGoal("longTermGoals")}
          sx={{
            mt: 1,
            backgroundColor: "#ffb942",
            "&:hover": {
              backgroundColor: "#ffcc00",
            },
          }}
        >
          <AddIcon />
          Add Long-term Goal
        </Button>
      </Box>
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

export default GoalForm;
