import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Typography, Button, Grid, Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import {
  CustomTextField,
  CustomSelect,
  CustomInputLabel,
  CustomMenuItem,
} from "../Fields"; // You can customize this import as needed
import Cookies from "js-cookie";
import AddIcon from "@mui/icons-material/Add";

const InsuranceForm = ({ onNext, onBack }) => {
  const [hospitilizationInsuranceCount, setHospitilizationInsuranceCount] =
    useState([0]);
  const [personalAccidentCount, setPersonalAccidentCount] = useState([0]);
  const [earlyAndCriticalIllnessCount, setEarlyAndCriticalIllnessCount] =
    useState([0]);
  const [criticalIllnessCount, setCriticalIllnessCount] = useState([0]);
  const [lifeInsuranceCount, setLifeInsuranceCount] = useState([0]);
  const [totalPermanentDisabilityCount, setTotalPermanentDisabilityCount] = useState([0]);


  const formik = useFormik({
    initialValues: {
      hasInsurance: "No",
      hospitilizationInsurance: hospitilizationInsuranceCount.map(() => ({
        provider: "",
        planName: "",
        hospitilizationAssuranceAmount: "",
        policyNumber: "",
        annualPayment: "",
        annualPaymentCPF: "",
        cashRider: "No",
        wardType: "",
      })),
      personalAccident: personalAccidentCount.map(() => ({
        provider: "",
        planName: "",
        policyNumber: "",
        annualPayment: "",
      })),
      earlyAndCriticalIllness: earlyAndCriticalIllnessCount.map(() => ({
        provider: "",
        planName: "",
        policyNumber: "",
        earlyIllnessSumAssured: "",
        criticalIllnessSumAssured: "",
        annualPayment: "",
      })),
      criticalIllness: criticalIllnessCount.map(() => ({
        provider: "",
        planName: "",
        policyNumber: "",
        criticalIllnessSumAssured: "",
        annualPayment: "",
      })),
      lifeInsurance: lifeInsuranceCount.map(() => ({
        provider: "",
        planName: "",
        policyNumber: "",
        lifeSumAssured: "",
        annualPayment: "",
      })),
      totalPermanentDisability: totalPermanentDisabilityCount.map(() => ({
        provider: "",
        planName: "",
        policyNumber: "",
        totalPermanentDisabilitySumAssured: "",
        annualPayment: "",
      })),
    },
    validationSchema: Yup.object().shape({
      hasInsurance: Yup.string().required("This field is required"),
      hospitilizationInsurance: Yup.array().of(
        Yup.object().shape({
          provider: Yup.string().optional(),
          planName: Yup.string().optional(),
          policyNumber: Yup.string().optional(),
          hospitilizationAssuranceAmount: Yup.string().optional(),
          annualPayment: Yup.number().optional().positive("Please enter a postive number"),
          annualPaymentCPF: Yup.number().optional().positive("Please enter a postive number"),
          cashRider: Yup.string().optional(),
          wardType: Yup.string().optional(),
        })
      ),
      personalAccident: Yup.array().of(
        Yup.object().shape({
          provider: Yup.string().optional(),
          planName: Yup.string().optional(),
          policyNumber: Yup.string().optional(),
          annualPayment: Yup.number().optional().positive("Please enter a postive number"),
        })
      ),
      earlyAndCriticalIllness: Yup.array().of(
        Yup.object().shape({
          provider: Yup.string().optional(),
          planName: Yup.string().optional(),
          policyNumber: Yup.string().optional(),
          earlyIllnessSumAssured: Yup.number().optional().positive("Please enter a postive number"),
          criticalIllnessSumAssured: Yup.number().optional().positive("Please enter a postive number"),
          annualPayment: Yup.number().optional().positive("Please enter a postive number"),
        })
      ),
      criticalIllness: Yup.array().of(
        Yup.object().shape({
          provider: Yup.string().optional(),
          planName: Yup.string().optional(),
          policyNumber: Yup.string().optional(),
          criticalIllnessSumAssured: Yup.number().optional().positive("Please enter a postive number"),
          annualPayment: Yup.number().optional().positive("Please enter a postive number"),
        })
      ),
      lifeInsurance: Yup.array().of(
        Yup.object().shape({
          provider: Yup.string().optional(),
          planName: Yup.string().optional(),
          policyNumber: Yup.string().optional(),
          lifeSumAssured: Yup.number().optional().positive("Please enter a postive number"),
          annualPayment: Yup.number().optional().positive("Please enter a postive number"),
        })
      ),
      totalPermanentDisability: Yup.array().of(
        Yup.object().shape({
          provider: Yup.string().optional(),
          planName: Yup.string().optional(),
          policyNumber: Yup.string().optional(),
          totalPermanentDisabilitySumAssured: Yup.number().optional().positive("Please enter a postive number"),
          annualPayment: Yup.number().optional().positive("Please enter a postive number"),
        })
      ),
    }),
    onSubmit: (values) => {
      // Save form data to cookies
      Cookies.set("insuranceFormData", JSON.stringify(values), {
        expires: 7,
      });
      onNext();
    },
  });

  // Load saved form data from cookies
  useEffect(() => {
    // Cookies.remove("insuranceFormData");
    const formDataFromCookies = Cookies.get("insuranceFormData");
    if (formDataFromCookies) {
      const parsedData = JSON.parse(formDataFromCookies);
      formik.setValues(parsedData);

      let arr = [0],
        mid = [0],
        long = [0],
        life = [0];


      for (
        let index = 0;
        index < parsedData["hospitilizationInsurance"].length - 1;
        index++
      ) {
        handleAddGoal("hospitilizationInsurance");
        arr.push(index + 1);
      }

      for (
        let index = 0;
        index < parsedData["personalAccident"].length - 1;
        index++
      ) {
        handleAddGoal("personalAccident");
        mid.push(index + 1);
      }

      for (
        let index = 0;
        index < parsedData["earlyAndCriticalIllness"].length - 1;
        index++
      ) {
        handleAddGoal("earlyAndCriticalIllness");
        long.push(index + 1);
      }

      for (
        let index = 0;
        index < parsedData["criticalIllness"].length - 1;
        index++
      ) {
        handleAddGoal("criticalIllness");
        long.push(index + 1);
      }

      for (
        let index = 0;
        index < parsedData["lifeInsurance"].length - 1;
        index++
      ) {
        handleAddGoal("lifeInsurance");
        life.push(index + 1);
      }


      for (
        let index = 0;
        index < parsedData["totalPermanentDisability"].length - 1;
        index++
      ) {
        handleAddGoal("totalPermanentDisability");
        life.push(index + 1);
      }


      setHospitilizationInsuranceCount(arr);
      setPersonalAccidentCount(mid);
      setEarlyAndCriticalIllnessCount(long);
      setCriticalIllnessCount(long);
      setLifeInsuranceCount(life);
      setTotalPermanentDisabilityCount(life);
    }
  }, []);


  const handleClick = async (event) => {
    event.preventDefault();
    await formik.handleSubmit();
    if (Object.keys(formik.errors).length > 0) {
      console.error('Form submission error:', formik.errors);
    }
  };

  const handleFieldChange = async (fieldName, value, goalType, index) => {
    const updatedValues = { ...formik.values };

    if (goalType != "") {
      updatedValues[goalType][index][fieldName] = value;
    } else {
      updatedValues[fieldName] = value;
    }

    await formik.setValues(updatedValues);
    setTimeout(() => {
      Cookies.set("insuranceFormData", JSON.stringify(updatedValues), {
        expires: 7,
      });
    }, 100);
  };

  const handleAddGoal = (type) => {
    if (
      type === "hospitilizationInsurance" &&
      hospitilizationInsuranceCount.length < 4
    ) {
      const newGoal = {
        provider: "",
        planName: "",
        hospitilizationAssuranceAmount: "",
        policyNumber: "",
        annualPayment: "",
      };

      setHospitilizationInsuranceCount((prevCounts) => [
        ...prevCounts,
        prevCounts.length,
      ]);

      const formDataFromCookies = Cookies.get("insuranceFormData");
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
    } else if (
      type === "personalAccident" &&
      personalAccidentCount.length < 4
    ) {
      const newGoal = {
        provider: "",
        planName: "",
        policyNumber: "",
        annualPayment: "",
      };

      setPersonalAccidentCount((prevCounts) => [
        ...prevCounts,
        prevCounts.length,
      ]);

      const formDataFromCookies = Cookies.get("insuranceFormData");
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
    } else if (
      type === "earlyAndCriticalIllness" &&
      earlyAndCriticalIllnessCount.length < 4
    ) {
      const newGoal = {
        provider: "",
        planName: "",
        policyNumber: "",
        earlyIllnessSumAssured: "",
        criticalIllnessSumAssured: "",
        annualPayment: "",
      };

      setEarlyAndCriticalIllnessCount((prevCounts) => [
        ...prevCounts,
        prevCounts.length,
      ]);

      const formDataFromCookies = Cookies.get("insuranceFormData");
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
    } else if (type === "criticalIllness" && criticalIllnessCount.length < 4) {
      const newGoal = {
        provider: "",
        planName: "",
        policyNumber: "",
        criticalIllnessSumAssured: "",
        annualPayment: "",
      };

      setCriticalIllnessCount((prevCounts) => [...prevCounts, prevCounts.length]);
        

      const formDataFromCookies = Cookies.get("insuranceFormData");
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
    } else if (type === "lifeInsurance" && lifeInsuranceCount.length < 4) {
      const newGoal = {
        provider: "",
        planName: "",
        policyNumber: "",
        lifeSumAssured: "",
        annualPayment: "",
      };

      setLifeInsuranceCount((prevCounts) => [...prevCounts, prevCounts.length]);

      const formDataFromCookies = Cookies.get("insuranceFormData");
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
    // else if (
    //   type === "totalPermanentDisability" &&
    //   totalPermanentDisabilityCount.length < 4
    // ) {
    //   const newGoal = {
    //     provider: "",
    //     planName: "",
    //     policyNumber: "",
    //     totalPermanentDisabilitySumAssured: "",
    //     annualPayment: "",
    //   };

    //   setTotalPermanentDisabilityCount((prevCounts) => [
    //     ...prevCounts,
    //     prevCounts.length,
    //   ]);

    //   const formDataFromCookies = Cookies.get("insuranceFormData");
    //   if (
    //     formDataFromCookies &&
    //     JSON.parse(formDataFromCookies)[type][formik.values[type].length] !=
    //     undefined
    //   ) {
    //     const parsedData = JSON.parse(formDataFromCookies);
    //     formik.setValues(parsedData);
    //   } else {
    //     formik.setFieldValue(type, [...formik.values[type], newGoal]);
    //   }
    // }

  };

  const handleRemoveGoal = (type, index) => {
    const goals = [...formik.values[type]];
    goals.splice(index, 1);
    formik.setFieldValue(type, goals);

    const formDataFromCookies = Cookies.get("insuranceFormData");
    if (formDataFromCookies) {
      const parsedData = JSON.parse(formDataFromCookies);
      if (parsedData[type]) {
        parsedData[type].splice(index, 1);
        setTimeout(() => {
          Cookies.set("insuranceFormData", JSON.stringify(parsedData), {
            expires: 7,
          });
        }, 101);
        formik.setValues(parsedData);
      }
    }

    if (type === "hospitilizationInsurance") {
      let temp = [];

      hospitilizationInsuranceCount.map((d) => {
        if (d !== index) {
          if (d > index) {
            temp.push(d - 1);
          } else {
            temp.push(d);
          }
        }
      });

      setHospitilizationInsuranceCount(temp);
    } else if (type === "personalAccident") {
      let temp = [];

      personalAccidentCount.map((d) => {
        if (d !== index) {
          if (d > index) {
            temp.push(d - 1);
          } else {
            temp.push(d);
          }
        }
      });

      setPersonalAccidentCount(temp);
    } else if (type === "earlyAndCriticalIllness") {
      let temp = [];

      earlyAndCriticalIllnessCount.map((d) => {
        if (d !== index) {
          if (d > index) {
            temp.push(d - 1);
          } else {
            temp.push(d);
          }
        }
      });
      setEarlyAndCriticalIllnessCount(temp);
    } else if (type === "lifeInsurance") {
      let temp = [];

      lifeInsuranceCount.map((d) => {
        if (d !== index) {
          if (d > index) {
            temp.push(d - 1);
          } else {
            temp.push(d);
          }
        }
      });
      setLifeInsuranceCount(temp);
    } else if (type === "criticalIllness") {
      let temp = [];

      criticalIllnessCount.map((d) => {
        if (d !== index) {
          if (d > index) {
            temp.push(d - 1);
          } else {
            temp.push(d);
          }
        }
      });
      setCriticalIllnessCount(temp);
    }

    //   else if (type === "totalPermanentDisability") {
    //   let temp = [];

    //   totalPermanentDisabilityCount.map((d) => {
    //     if (d !== index) {
    //       if (d > index) {
    //         temp.push(d - 1);
    //       } else {
    //         temp.push(d);
    //       }
    //     }
    //   });
    //   setTotalPermanentDisabilityCount(temp);
    // }
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Typography variant="h4" sx={{ color: "#ffb942", mb: 2.51 }}>
        Insurance
      </Typography>
      <FormControl
        fullWidth
        required
        error={
          formik.touched.hasInsurance && Boolean(formik.errors.hasInsurance)
        }
      >
        <CustomInputLabel>Do You Have Any Insurance?</CustomInputLabel>
        <CustomSelect
          name="hasInsurance"
          label="Do You Have Any Insurance?"
          value={formik.values.hasInsurance}
          onChange={(e) =>
            handleFieldChange("hasInsurance", e.target.value, "")
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
      {formik.values.hasInsurance === "Yes" && (
        <>
          <Typography variant="h5" sx={{ color: "#ffb942", mt: 1.51 }}>
            Hospitalisation and Surgical
          </Typography>
          {hospitilizationInsuranceCount.map((index) => {
            return (
              <Grid container spacing={2} key={index} mt={0.5}>
                <Grid item xs={12} sm={4}>
                  <CustomTextField
                    fullWidth
                    name={`hospitilizationInsurance[${index}].provider`}
                    label="Policy Provider"
                    value={
                      formik.values.hospitilizationInsurance[index].provider
                    }
                    onChange={(e) =>
                      handleFieldChange(
                        "provider",
                        e.target.value,
                        "hospitilizationInsurance",
                        index
                      )
                    }
                    InputProps={{
                      style: { color: "#ffb942" },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <CustomTextField
                    fullWidth
                    name={`hospitilizationInsurance[${index}].planName`}
                    label="Plan Name"
                    value={
                      formik.values.hospitilizationInsurance[index].planName
                    }
                    onChange={(e) =>
                      handleFieldChange(
                        "planName",
                        e.target.value,
                        "hospitilizationInsurance",
                        index
                      )
                    }
                    InputProps={{
                      style: { color: "#ffb942" },
                    }}
                  />
                </Grid>
                {/* <Grid item xs={12} sm={4}>
                  <CustomTextField
                    fullWidth
                    name={`hospitilizationInsurance[${index}].hospitilizationAssuranceAmount`}
                    label="Type of Ward"
                    value={
                      formik.values.hospitilizationInsurance[index]
                        .hospitilizationAssuranceAmount
                    }
                    onChange={(e) =>
                      handleFieldChange(
                        "hospitilizationAssuranceAmount",
                        e.target.value,
                        "hospitilizationInsurance",
                        index
                      )
                    }
                    InputProps={{
                      style: { color: "#ffb942" },
                    }}
                  />
                </Grid> */}
                <Grid item xs={12} sm={4}>
                  <FormControl
                    fullWidth
                    error={
                      formik.touched.hasInsurance &&
                      Boolean(formik.errors.hasInsurance)
                    }
                  >
                    <CustomInputLabel>Ward Type</CustomInputLabel>
                    <CustomSelect
                      name={`hospitilizationInsurance[${index}].wardType`}
                      value={formik.values.hospitilizationInsurance[index].wardType}
                      onChange={(e) =>
                        handleFieldChange(
                          "wardType",
                          e.target.value,
                          "hospitilizationInsurance",
                          index
                        )
                      }
                      MenuProps={{
                        PaperProps: {
                          style: { background: "#292829" },
                        },
                      }}
                    >
                      <CustomMenuItem value="Private Hospital">Private Hospital</CustomMenuItem>
                      <CustomMenuItem value="Ward A">Ward A</CustomMenuItem>
                      <CustomMenuItem value="Ward B1">Ward B1</CustomMenuItem>
                      <CustomMenuItem value="Ward B2 and below">Ward B2 and below</CustomMenuItem>
                    </CustomSelect>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl
                    fullWidth
                    error={
                      formik.touched.hasInsurance &&
                      Boolean(formik.errors.hasInsurance)
                    }
                  >
                    <CustomInputLabel>Is There a Cash Rider?</CustomInputLabel>
                    <CustomSelect
                      name="cashRider"
                      label="Is There a Cash Rider?"
                      value={
                        formik.values.hospitilizationInsurance[index].cashRider
                      }
                      onChange={(e) =>
                        handleFieldChange(
                          "cashRider",
                          e.target.value,
                          "hospitilizationInsurance",
                          index
                        )
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
                <Grid item xs={12} sm={4}>
                  <CustomTextField
                    fullWidth
                    name={`hospitilizationInsurance[${index}].policyNumber`}
                    label="Policy Number"
                    type="number"
                    value={
                      formik.values.hospitilizationInsurance[index].policyNumber
                    }
                    onChange={(e) =>
                      handleFieldChange(
                        "policyNumber",
                        e.target.value,
                        "hospitilizationInsurance",
                        index
                      )
                    }
                    InputProps={{
                      style: { color: "#ffb942" },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <CustomTextField
                    fullWidth
                    name={`hospitilizationInsurance[${index}].annualPayment`}
                    label="Annual Payment (Cash)"
                    type="number"
                    value={
                      formik.values.hospitilizationInsurance[index]
                        .annualPayment
                    }
                    onChange={(e) =>
                      handleFieldChange(
                        "annualPayment",
                        e.target.value,
                        "hospitilizationInsurance",
                        index
                      )
                    }
                    InputProps={{
                      style: { color: "#ffb942" },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <CustomTextField
                    fullWidth
                    name={`hospitilizationInsurance[${index}].annualPaymentCPF`}
                    label="Annual Payment (CPF)"
                    type="number"
                    value={
                      formik.values.hospitilizationInsurance[index]
                        .annualPaymentCPF
                    }
                    onChange={(e) =>
                      handleFieldChange(
                        "annualPaymentCPF",
                        e.target.value,
                        "hospitilizationInsurance",
                        index
                      )
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
                        // color="secondary"
                        onClick={() =>
                          handleRemoveGoal("hospitilizationInsurance", index)
                        }
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
              onClick={() => handleAddGoal("hospitilizationInsurance")}
              sx={{
                mt: 1,
                backgroundColor: "#ffb942",
                "&:hover": {
                  backgroundColor: "#ffcc00",
                },
              }}
            >
              <AddIcon />
              Add Hospitalisation and Surgical Insurance
            </Button>
          </Box>

          <Typography variant="h5" sx={{ color: "#ffb942" }}>
            Personal Accident
          </Typography>
          {personalAccidentCount.map((index) => (
            <Grid container spacing={2} key={index} mt={0.5}>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  name={`personalAccident[${index}].provider`}
                  label="Policy Provider"
                  value={formik.values.personalAccident[index].provider}
                  onChange={(e) =>
                    handleFieldChange(
                      "provider",
                      e.target.value,
                      "personalAccident",
                      index
                    )
                  }
                  InputProps={{
                    style: { color: "#ffb942" },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  name={`personalAccident[${index}].planName`}
                  label="Plan Name"
                  value={formik.values.personalAccident[index].planName}
                  onChange={(e) =>
                    handleFieldChange(
                      "planName",
                      e.target.value,
                      "personalAccident",
                      index
                    )
                  }
                  InputProps={{
                    style: { color: "#ffb942" },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  name={`personalAccident[${index}].policyNumber`}
                  label="Policy Number"
                  type="number"
                  value={formik.values.personalAccident[index].policyNumber}
                  onChange={(e) =>
                    handleFieldChange(
                      "policyNumber",
                      e.target.value,
                      "personalAccident",
                      index
                    )
                  }
                  InputProps={{
                    style: { color: "#ffb942" },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <CustomTextField
                  fullWidth
                  name={`personalAccident[${index}].annualPayment`}
                  label="Annual Payment"
                  type="number"
                  value={formik.values.personalAccident[index].annualPayment}
                  onChange={(e) =>
                    handleFieldChange(
                      "annualPayment",
                      e.target.value,
                      "personalAccident",
                      index
                    )
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
                      onClick={() =>
                        handleRemoveGoal("personalAccident", index)
                      }
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
              onClick={() => handleAddGoal("personalAccident")}
              sx={{
                mt: 1,
                backgroundColor: "#ffb942",
                "&:hover": {
                  backgroundColor: "#ffcc00",
                },
              }}
            >
              <AddIcon />
              Add Personal Accident Policy
            </Button>
          </Box>

          <Typography variant="h5" sx={{ color: "#ffb942" }}>
            Early and Critical Illness Policy
          </Typography>
          {earlyAndCriticalIllnessCount.map((index) => (
            <Grid container spacing={2} key={index} mt={0.5}>
              <Grid item xs={12} sm={4}>
                <CustomTextField
                  fullWidth
                  name={`earlyAndCriticalIllness[${index}].provider`}
                  label="Policy Provider"
                  value={formik.values.earlyAndCriticalIllness[index].provider}
                  onChange={(e) =>
                    handleFieldChange(
                      "provider",
                      e.target.value,
                      "earlyAndCriticalIllness",
                      index
                    )
                  }
                  InputProps={{
                    style: { color: "#ffb942" },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <CustomTextField
                  fullWidth
                  name={`earlyAndCriticalIllness[${index}].planName`}
                  label="Plan Name"
                  value={formik.values.earlyAndCriticalIllness[index].planName}
                  onChange={(e) =>
                    handleFieldChange(
                      "planName",
                      e.target.value,
                      "earlyAndCriticalIllness",
                      index
                    )
                  }
                  InputProps={{
                    style: { color: "#ffb942" },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <CustomTextField
                  fullWidth
                  name={`earlyAndCriticalIllness[${index}].policyNumber`}
                  label="Policy Number"
                  type="number"
                  value={
                    formik.values.earlyAndCriticalIllness[index].policyNumber
                  }
                  onChange={(e) =>
                    handleFieldChange(
                      "policyNumber",
                      e.target.value,
                      "earlyAndCriticalIllness",
                      index
                    )
                  }
                  InputProps={{
                    style: { color: "#ffb942" },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <CustomTextField
                  fullWidth
                  name={`earlyAndCriticalIllness[${index}].earlyIllnessSumAssured`}
                  label="Early Illness Assured Sum"
                  type="number"
                  value={
                    formik.values.earlyAndCriticalIllness[index]
                      .earlyIllnessSumAssured
                  }
                  onChange={(e) =>
                    handleFieldChange(
                      "earlyIllnessSumAssured",
                      e.target.value,
                      "earlyAndCriticalIllness",
                      index
                    )
                  }
                  InputProps={{
                    style: { color: "#ffb942" },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <CustomTextField
                  fullWidth
                  name={`earlyAndCriticalIllness[${index}].criticalIllnessSumAssured`}
                  label="Critical Illness Assured Sum"
                  type="number"
                  value={
                    formik.values.earlyAndCriticalIllness[index]
                      .criticalIllnessSumAssured
                  }
                  onChange={(e) =>
                    handleFieldChange(
                      "criticalIllnessSumAssured",
                      e.target.value,
                      "earlyAndCriticalIllness",
                      index
                    )
                  }
                  InputProps={{
                    style: { color: "#ffb942" },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <CustomTextField
                  fullWidth
                  name={`earlyAndCriticalIllness[${index}].annualPayment`}
                  label="Annual Payment"
                  type="number"
                  value={
                    formik.values.earlyAndCriticalIllness[index].annualPayment
                  }
                  onChange={(e) =>
                    handleFieldChange(
                      "annualPayment",
                      e.target.value,
                      "earlyAndCriticalIllness",
                      index
                    )
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
                      onClick={() =>
                        handleRemoveGoal("earlyAndCriticalIllness", index)
                      }
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
              onClick={() => handleAddGoal("earlyAndCriticalIllness")}
              sx={{
                mt: 1,
                backgroundColor: "#ffb942",
                "&:hover": {
                  backgroundColor: "#ffcc00",
                },
              }}
            >
              <AddIcon />
              Add Early and Critical Illness Policy
            </Button>
          </Box>

          <Typography variant="h5" sx={{ color: "#ffb942" }}>
            Critical Illness Policy
          </Typography>
          {criticalIllnessCount.map((index) => (
            <Grid container spacing={2} key={index} mt={0.5}>
              <Grid item xs={12} sm={4}>
                <CustomTextField
                  fullWidth
                  name={`criticalIllness[${index}].provider`}
                  label="Policy Provider"
                  value={formik.values.criticalIllness[index].provider}
                  onChange={(e) => handleFieldChange("provider", e.target.value, "criticalIllness", index)}
                  InputProps={{ style: { color: "#ffb942" } }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <CustomTextField
                  fullWidth
                  name={`criticalIllness[${index}].planName`}
                  label="Plan Name" 
                  value={formik.values.criticalIllness[index].planName}
                  onChange={(e) => handleFieldChange("planName", e.target.value, "criticalIllness", index)}
                  InputProps={{ style: { color: "#ffb942" } }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <CustomTextField
                  fullWidth
                  name={`criticalIllness[${index}].policyNumber`}
                  label="Policy Number"
                  type="number"
                  value={formik.values.criticalIllness[index].policyNumber}
                  onChange={(e) => handleFieldChange("policyNumber", e.target.value, "criticalIllness", index)}
                  InputProps={{ style: { color: "#ffb942" } }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <CustomTextField

                  fullWidth
                  name={`criticalIllness[${index}].criticalIllnessSumAssured`}
                  label="Critical Illness Assured Sum"
                  type="number"
                  value={formik.values.criticalIllness[index].criticalIllnessSumAssured}
                  onChange={(e) => handleFieldChange("criticalIllnessSumAssured", e.target.value, "criticalIllness", index)}
                  InputProps={{ style: { color: "#ffb942" } }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <CustomTextField  
                  fullWidth
                  name={`criticalIllness[${index}].annualPayment`}
                  label="Annual Payment"
                  type="number"
                  value={formik.values.criticalIllness[index].annualPayment}
                  onChange={(e) => handleFieldChange("annualPayment", e.target.value, "criticalIllness", index)}
                  InputProps={{ style: { color: "#ffb942" } }}
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
                      onClick={() => handleRemoveGoal("criticalIllness", index)}
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
              onClick={() => handleAddGoal("criticalIllness")}
              sx={{
                mt: 1,
                backgroundColor: "#ffb942",
                "&:hover": {
                  backgroundColor: "#ffcc00",
                },
              }}
            >
              <AddIcon />
              Add Critical Illness Policy
            </Button>
          </Box>
          

          <Typography variant="h5" sx={{ color: "#ffb942" }}>
            Life Insurance Policy
          </Typography>
          {lifeInsuranceCount.map((index) => (
            <Grid container spacing={2} key={index} mt={0.5}>
              <Grid item xs={12} sm={4}>
                <CustomTextField
                  fullWidth
                  name={`lifeInsurance[${index}].provider`}
                  label="Policy Provider"
                  value={formik.values.lifeInsurance[index].provider}
                  onChange={(e) =>
                    handleFieldChange(
                      "provider",
                      e.target.value,
                      "lifeInsurance",
                      index
                    )
                  }
                  InputProps={{
                    style: { color: "#ffb942" },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <CustomTextField
                  fullWidth
                  name={`lifeInsurance[${index}].planName`}
                  label="Plan Name"
                  value={formik.values.lifeInsurance[index].planName}
                  onChange={(e) =>
                    handleFieldChange(
                      "planName",
                      e.target.value,
                      "lifeInsurance",
                      index
                    )
                  }
                  InputProps={{
                    style: { color: "#ffb942" },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <CustomTextField
                  fullWidth
                  name={`lifeInsurance[${index}].policyNumber`}
                  label="Policy Number"
                  type="number"
                  value={formik.values.lifeInsurance[index].policyNumber}
                  onChange={(e) =>
                    handleFieldChange(
                      "policyNumber",
                      e.target.value,
                      "lifeInsurance",
                      index
                    )
                  }
                  InputProps={{
                    style: { color: "#ffb942" },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <CustomTextField
                  fullWidth
                  name={`lifeInsurance[${index}].earlyIllnessSumAssured`}
                  label="Assured Sum"
                  type="number"
                  value={
                    formik.values.lifeInsurance[index].earlyIllnessSumAssured
                  }
                  onChange={(e) =>
                    handleFieldChange(
                      "earlyIllnessSumAssured",
                      e.target.value,
                      "lifeInsurance",
                      index
                    )
                  }
                  InputProps={{
                    style: { color: "#ffb942" },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <CustomTextField
                  fullWidth
                  name={`lifeInsurance[${index}].annualPayment`}
                  label="Annual Payment"
                  type="number"
                  value={formik.values.lifeInsurance[index].annualPayment}
                  onChange={(e) =>
                    handleFieldChange(
                      "annualPayment",
                      e.target.value,
                      "lifeInsurance",
                      index
                    )
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
                      onClick={() => handleRemoveGoal("lifeInsurance", index)}
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
              onClick={() => handleAddGoal("lifeInsurance")}
              sx={{
                mt: 1,
                backgroundColor: "#ffb942",
                "&:hover": {
                  backgroundColor: "#ffcc00",
                },
              }}
            >
              <AddIcon />
              Add Life Insurance Policy
            </Button>
          </Box>

          <Typography variant="h5" sx={{ color: "#ffb942" }}>
            Total Permanent Disability
          </Typography>
          {totalPermanentDisabilityCount.map((index) => (
            <Grid container spacing={2} key={index} mt={0.5}>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  name={`totalPermanentDisability[${index}].provider`}
                  label="Policy Provider"
                  value={formik.values.totalPermanentDisability[index].provider}
                  onChange={(e) =>
                    handleFieldChange(
                      "provider",
                      e.target.value,
                      "totalPermanentDisability",
                      index
                    )
                  }
                  InputProps={{
                    style: { color: "#ffb942" },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  name={`totalPermanentDisability[${index}].planName`}
                  label="Plan Name"
                  value={formik.values.totalPermanentDisability[index].planName}
                  onChange={(e) =>
                    handleFieldChange(
                      "planName",
                      e.target.value,
                      "totalPermanentDisability",
                      index
                    )
                  }
                  InputProps={{
                    style: { color: "#ffb942" },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  name={`totalPermanentDisability[${index}].policyNumber`}
                  label="Policy Number"
                  type="number"
                  value={formik.values.totalPermanentDisability[index].policyNumber}
                  onChange={(e) =>
                    handleFieldChange(
                      "policyNumber",
                      e.target.value,
                      "totalPermanentDisability",
                      index
                    )
                  }
                  InputProps={{
                    style: { color: "#ffb942" },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  name={`totalPermanentDisability[${index}].totalPermanentDisabilitySumAssured`}
                  label="Assured Sum"
                  type="number"
                  value={formik.values.totalPermanentDisability[index].totalPermanentDisabilitySumAssured}
                  onChange={(e) =>
                    handleFieldChange(
                      "totalPermanentDisabilitySumAssured",
                      e.target.value,
                      "totalPermanentDisability",
                      index
                    )
                  }
                  InputProps={{
                    style: { color: "#ffb942" },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={5}>
                <CustomTextField
                  fullWidth
                  name={`totalPermanentDisability[${index}].annualPayment`}
                  label="Annual Payment"
                  type="number"
                  value={formik.values.totalPermanentDisability[index].annualPayment}
                  onChange={(e) =>
                    handleFieldChange(
                      "annualPayment",
                      e.target.value,
                      "totalPermanentDisability",
                      index
                    )
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
                      onClick={() =>
                        handleRemoveGoal("personalAccident", index)
                      }
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
              onClick={() => handleAddGoal("personalAccident")}
              sx={{
                mt: 1,
                backgroundColor: "#ffb942",
                "&:hover": {
                  backgroundColor: "#ffcc00",
                },
              }}
            >
              <AddIcon />
              Add Total Permanent Disability Policy
            </Button>
          </Box>
        </>
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
          onClick={handleClick}
          type="button"
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

export default InsuranceForm;
