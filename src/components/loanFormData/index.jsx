import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import {
  CustomInputLabel,
  CustomMenuItem,
  CustomSelect,
  CustomTextField,
} from "../Fields";
import Cookies from "js-cookie";

const LoanForm = ({ onNext, saveFormData, onBack }) => {
  const [isFormValid, setIsFormValid] = useState(false);

  const validationSchema = Yup.object({
    hasLongTermLoans: Yup.string().required("This field is required"),
    remainingRenovationLoan: Yup.number().nullable(),
    remainingVehicleLoan: Yup.number().nullable(),
    remainingStudyLoan: Yup.number().nullable(),
    remainingOtherLoan: Yup.number().nullable(),
    mortgage: Yup.number().optional(),
    hasShortTermLoan: Yup.string().required("This field is required"), // Consider renaming to hasShortTermLoans for consistency
    remainingCreditCardsLoan: Yup.number().nullable(),
    remainingPersonalDebitLoan: Yup.number().nullable(),
    incomeTaxLastYear: Yup.number().nullable(),
  }).test('long-term-loans-check', 'At least one long-term loan field is required', function (value) {
    if (value.hasLongTermLoans === "Yes") {
      const hasAnyLongTermLoan = Boolean(value.mortgage || value.remainingRenovationLoan || value.remainingVehicleLoan || value.remainingStudyLoan || value.remainingOtherLoan);
      if (!hasAnyLongTermLoan) {
        // Correctly use this.createError to return a validation error
        return this.createError({ path: 'hasLongTermLoans', message: 'At least one long-term loan amount is required' });
      }
    }
    return true; // Validation passed
  }).test('short-term-loans-check', 'At least one short-term loan field is required', function (value) {
    if (value.hasShortTermLoan === "Yes") {
      const hasAnyShortTermLoan = Boolean(value.remainingCreditCardsLoan || value.remainingPersonalDebitLoan);
      if (!hasAnyShortTermLoan) {
        // Correctly use this.createError to return a validation error
        return this.createError({ path: 'hasShortTermLoan', message: 'At least one short-term loan amount is required' });
      }
    }
    return true; // Validation passed
  });

  const formik = useFormik({
    initialValues: {
      hasLongTermLoans: "No",
      remainingRenovationLoan: "",
      remainingVehicleLoan: "",
      remainingStudyLoan: "",
      remainingOtherLoan: "",
      mortgage: "",
      hasShortTermLoan: "No",
      remainingCreditCardsLoan: "",
      remainingPersonalDebitLoan: "",
      incomeTaxLastYear: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onNext();
    },
  });

  useEffect(() => {
    const formDataFromCookies = Cookies.get("loanFormData");
    if (formDataFromCookies) {
      const parsedData = JSON.parse(formDataFromCookies);
      formik.setValues(parsedData);
    }
  }, []);

  const handleFieldChange = async (fieldName, value) => {
    const updatedValues = { ...formik.values, [fieldName]: value };
    await formik.setValues(updatedValues);

    formik.validateForm().then((errors) => {
      if (Object.keys(errors).length === 0) {
        setIsFormValid(true);
      } else {
        setIsFormValid(false);
      }
    });

    setTimeout(() => {
      Cookies.set("loanFormData", JSON.stringify(updatedValues), {
        expires: 7,
      });
    }, 100);
  };

  return (
    <form onSubmit={formik.handleSubmit} noValidate>
      <Typography variant="h4" sx={{ color: "#ffb942", mb: 2.51 }}>
        Loans
      </Typography>
      <Typography variant="body2" sx={{ color: "#ffb942", fontStyle: "italic", mt: 1 }}>
        Enter 0 if not applicable
      </Typography>
      <Typography variant="h5" sx={{ color: "#ffb942", mb: 1.51, mt: 1.51 }}>
        Long-Term Loan
      </Typography>
      <Grid container spacing={2}>

        <Grid item xs={12} sm={12}>
          <FormControl
            fullWidth
            required
            error={
              formik.touched.hasLongTermLoans &&
              Boolean(formik.errors.hasLongTermLoans)
            }
          >
            <CustomInputLabel>Any long term loans?</CustomInputLabel>
            <CustomSelect
              name="hasLongTermLoans"
              label="Any long term loans?"
              value={formik.values.hasLongTermLoans}
              onChange={(e) => {
                formik.handleChange(e);
                handleFieldChange("hasLongTermLoans", e.target.value);
              }}
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
      {formik.values.hasLongTermLoans === "Yes" && (
        <Grid container spacing={2} sx={{ mt: 1.51, mb: 1.51 }}>
          {JSON.parse(Cookies.get("netWorthFormData"))
            .currentValueOfResidence != 0 && (
              <Grid item xs={12} sm={4}>
                <CustomTextField
                  fullWidth
                  name="mortgage"
                  label="Mortgage"
                  value={formik.values.mortgage}
                  onChange={(e) => {
                    formik.handleChange(e);
                    handleFieldChange("mortgage", e.target.value);
                  }}
                  error={
                    formik.touched.mortgage && Boolean(formik.errors.mortgage)
                  }
                  helperText={
                    formik.touched.mortgage && formik.errors.mortgage
                  }
                  required={formik.values.hasLongTermLoans === "Yes"}
                  InputProps={{
                    style: { color: "#ffb942" },
                  }}
                  type="number"
                />
              </Grid>
            )}

          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="remainingRenovationLoan"
              label="Remaining Renovation Loan"
              value={formik.values.remainingRenovationLoan}
              onChange={(e) => {
                formik.handleChange(e);
                handleFieldChange("remainingRenovationLoan", e.target.value);
              }}
              error={
                formik.touched.remainingRenovationLoan &&
                Boolean(formik.errors.remainingRenovationLoan)
              }
              helperText={
                formik.touched.remainingRenovationLoan &&
                formik.errors.remainingRenovationLoan
              }
              required={formik.values.hasLongTermLoans === "Yes"}
              InputProps={{
                style: { color: "#ffb942" },
              }}
              type="number"
            />
          </Grid>
          {JSON.parse(Cookies.get("netWorthFormData")).currentValueOfVehicle !=
            0 && (
              <Grid item xs={12} sm={4}>
                <CustomTextField
                  fullWidth
                  name="remainingVehicleLoan"
                  label="Remaining Vehicle Loan"
                  value={formik.values.remainingVehicleLoan}
                  onChange={(e) => {
                    formik.handleChange(e);
                    handleFieldChange("remainingVehicleLoan", e.target.value);
                  }}
                  error={
                    formik.touched.remainingVehicleLoan &&
                    Boolean(formik.errors.remainingVehicleLoan)
                  }
                  helperText={
                    formik.touched.remainingVehicleLoan &&
                    formik.errors.remainingVehicleLoan
                  }
                  required={formik.values.hasLongTermLoans === "Yes"}
                  InputProps={{
                    style: { color: "#ffb942" },
                  }}
                  type="number"
                />
              </Grid>
            )}
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="remainingStudyLoan"
              label="Remaining Study Loan"
              value={formik.values.remainingStudyLoan}
              onChange={(e) => {
                formik.handleChange(e);
                handleFieldChange("remainingStudyLoan", e.target.value);
              }}
              error={
                formik.touched.remainingStudyLoan &&
                Boolean(formik.errors.remainingStudyLoan)
              }
              helperText={
                formik.touched.remainingStudyLoan &&
                formik.errors.remainingStudyLoan
              }
              required={formik.values.hasLongTermLoans === "Yes"}
              InputProps={{
                style: { color: "#ffb942" },
              }}
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="remainingOtherLoan"
              label="Remaining Other Loan"
              value={formik.values.remainingOtherLoan}
              onChange={(e) => {
                formik.handleChange(e);
                handleFieldChange("remainingOtherLoan", e.target.value);
              }}
              error={
                formik.touched.remainingOtherLoan &&
                Boolean(formik.errors.remainingOtherLoan)
              }
              helperText={
                formik.touched.remainingOtherLoan &&
                formik.errors.remainingOtherLoan
              }
              required={formik.values.hasLongTermLoans === "Yes"}
              InputProps={{
                style: { color: "#ffb942" },
              }}
              type="number"
            />
          </Grid>
          {/* mortgage */}

        </Grid>
      )}
      <Typography variant="h5" sx={{ color: "#ffb942", mb: 0.51, mt: 0.51 }}>
        Short-Term Loan
      </Typography>
      <Grid container spacing={2} sx={{ mt: 0.51, mb: 0.51 }}>
        <Grid item xs={12} sm={12}>
          <FormControl
            fullWidth
            required
            error={
              formik.touched.hasShortTermLoan &&
              Boolean(formik.errors.hasShortTermLoan)
            }
          >
            <CustomInputLabel>Any short term loan?</CustomInputLabel>
            <CustomSelect
              name="hasShortTermLoan"
              label="Any short term loan?"
              value={formik.values.hasShortTermLoan}
              onChange={(e) => {
                formik.handleChange(e);
                handleFieldChange("hasShortTermLoan", e.target.value);
              }}
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
        {formik.values.hasShortTermLoan === "Yes" && (
          <>
            <Grid item xs={12} sm={4}>
              <CustomTextField
                fullWidth
                name="remainingCreditCardsLoan"
                label="Remaining Credit Cards Loan"
                value={formik.values.remainingCreditCardsLoan}
                onChange={(e) => {
                  formik.handleChange(e);
                  handleFieldChange("remainingCreditCardsLoan", e.target.value);
                }}
                error={
                  formik.touched.remainingCreditCardsLoan &&
                  Boolean(formik.errors.remainingCreditCardsLoan)
                }
                helperText={
                  formik.touched.remainingCreditCardsLoan &&
                  formik.errors.remainingCreditCardsLoan
                }
                required={formik.values.hasShortTermLoan === "Yes"}
                InputProps={{
                  style: { color: "#ffb942" },
                }}
                type="number"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomTextField
                fullWidth
                name="remainingPersonalDebitLoan"
                label="Remaining Personal Debt Loan"
                value={formik.values.remainingPersonalDebitLoan}
                onChange={(e) => {
                  formik.handleChange(e);
                  handleFieldChange(
                    "remainingPersonalDebitLoan",
                    e.target.value
                  );
                }}
                error={
                  formik.touched.remainingPersonalDebitLoan &&
                  Boolean(formik.errors.remainingPersonalDebitLoan)
                }
                helperText={
                  formik.touched.remainingPersonalDebitLoan &&
                  formik.errors.remainingPersonalDebitLoan
                }
                required={formik.values.hasShortTermLoan === "Yes"}
                InputProps={{
                  style: { color: "#ffb942" },
                }}
                type="number"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomTextField
                fullWidth
                name="incomeTaxLastYear"
                label="Income Tax Last Year"
                value={formik.values.incomeTaxLastYear}
                onChange={(e) => {
                  formik.handleChange(e);
                  handleFieldChange("incomeTaxLastYear", e.target.value);
                }}
                error={
                  formik.touched.incomeTaxLastYear &&
                  Boolean(formik.errors.incomeTaxLastYear)
                }
                helperText={
                  formik.touched.incomeTaxLastYear &&
                  formik.errors.incomeTaxLastYear
                }
                InputProps={{
                  style: { color: "#ffb942" },
                }}
                type="number"
              />
            </Grid>
          </>
        )}
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

export default LoanForm;
