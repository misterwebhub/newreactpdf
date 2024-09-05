import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";
import { CustomDivider, CustomTextField } from "../Fields";
import Cookies from "js-cookie";

const CashFlowStatementForm = ({ onNext, onBack }) => {
  const formik = useFormik({
    initialValues: {
      annualSalary: "",
      annualBonus: "",
      annualInvestmentIncome: "",
      rentalIncomeAnnual: "",
      otherIncomeAnnual: "",
      annualSavings: "",
      annualInvestments: "",
      mortgagePayAnnually: "",
      loansPayAnnually: "",
      payForInsuranceAnnually: "",
      payForHouseholdAnnually: "",
      payForTransportAnnually: "",
      payForDependenstAnnually: "",
      payForPersonalExpensesAnnually: "",
      payForMedicalAnnually: "",
      payForMiscellaniousAnnually: "",
      giveForFamilyBlessingsAnnually: "",
    },
    validationSchema: Yup.object({
      annualSalary: Yup.number().optional(),
      giveForFamilyBlessingsAnnually: Yup.number().optional(),
      annualBonus: Yup.number().optional(),
      annualInvestmentIncome: Yup.number().optional(),
      rentalIncomeAnnual: Yup.number().optional(),

      otherIncomeAnnual: Yup.number().optional(),
      payForMiscellaniousAnnually: Yup.number().optional(),
      bond: Yup.string().optional(),
      stocks: Yup.string().optional(),
      annualSavings: Yup.number().required("Annual Savings is required"),
      unitTrusts: Yup.string().optional(),

      equities: Yup.string().optional(),
      annualInvestments: Yup.number().required(
        "Annual Investments is required"
      ),
      insurancePolicies: Yup.string().optional(),
      mortgagePayAnnually: Yup.number().optional(),
      commodities: Yup.string().optional(),
      loansPayAnnually: Yup.number().optional(),
      properties: Yup.string().optional(),
      payForInsuranceAnnually: Yup.number().optional(),
      cryptocurrencies: Yup.string().optional(),
      payForHouseholdAnnually: Yup.number().optional(),
      otherInvestments: Yup.string().optional(),
      payForTransportAnnually: Yup.number().optional(),
      payForDependenstAnnually: Yup.number().optional(),
      payForPersonalExpensesAnnually:
        Yup.number().optional(),
      payForMedicalAnnually: Yup.number().optional(),
    }),
    onSubmit: (values) => {
      // Save form data to cookies
      Cookies.set("cashFlowStatementFormData", JSON.stringify(values), {
        expires: 7,
      });
      onNext();
    },
  });

  // Load saved form data from cookies
  useEffect(() => {
    const formDataFromCookies = Cookies.get("cashFlowStatementFormData");
    if (formDataFromCookies) {
      const parsedData = JSON.parse(formDataFromCookies);
      formik.setValues(parsedData);
    }
  }, []);

  const handleFieldChange = async (fieldName, value) => {
    const updatedValues = { ...formik.values, [fieldName]: value };
    await formik.setValues(updatedValues);

    setTimeout(() => {
      Cookies.set("cashFlowStatementFormData", JSON.stringify(updatedValues), {
        expires: 7,
      });
    }, 100);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Typography variant="h4" sx={{ color: "#ffb942", mb: 2.51 }}>
        Cash Flow Statement
      </Typography>
      <Typography variant="h5" sx={{ color: "#ffb942" }}>
        Inflow
      </Typography>
      <Grid container spacing={2} mt={0.5}>
        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            name="annualSalary"
            label="Annual Salary"
            type="number"
            value={formik.values.annualSalary}
            onChange={(e) => handleFieldChange("annualSalary", e.target.value)}
            InputProps={{
              style: { color: "#ffb942" },
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            name="annualBonus"
            label="Annual Bonus"
            type="number"
            value={formik.values.annualBonus}
            onChange={(e) => handleFieldChange("annualBonus", e.target.value)}
            InputProps={{
              style: { color: "#ffb942" },
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            name="annualInvestmentIncome"
            label="Annual Investment Income"
            type="number"
            value={formik.values.annualInvestmentIncome}
            onChange={(e) =>
              handleFieldChange("annualInvestmentIncome", e.target.value)
            }
            InputProps={{
              style: { color: "#ffb942" },
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            name="rentalIncomeAnnual"
            label="Rental Income Annual"
            type="number"
            value={formik.values.rentalIncomeAnnual}
            onChange={(e) =>
              handleFieldChange("rentalIncomeAnnual", e.target.value)
            }
            InputProps={{
              style: { color: "#ffb942" },
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            name="otherIncomeAnnual"
            label="Other Income Annual"
            type="number"
            value={formik.values.otherIncomeAnnual}
            onChange={(e) =>
              handleFieldChange("otherIncomeAnnual", e.target.value)
            }
            InputProps={{
              style: { color: "#ffb942" },
            }}
          />
        </Grid>
      </Grid>
      <CustomDivider />
      <Typography variant="h5" sx={{ color: "#ffb942" }}>
        Savings and Investments Outflows
      </Typography>
      <Grid container spacing={2} mt={0.51}>
        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            name="annualSavings"
            label="Annual Savings"
            type="number"
            value={formik.values.annualSavings}
            onChange={(e) => handleFieldChange("annualSavings", e.target.value)}
            InputProps={{
              style: { color: "#ffb942" },
            }}
            error={
              formik.touched.annualSavings &&
              Boolean(formik.errors.annualSavings)
            }
            helperText={
              formik.touched.annualSavings && formik.errors.annualSavings
            }
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            name="annualInvestments"
            label="Annual Investments"
            type="number"
            value={formik.values.annualInvestments}
            onChange={(e) =>
              handleFieldChange("annualInvestments", e.target.value)
            }
            InputProps={{
              style: { color: "#ffb942" },
            }}
            error={
              formik.touched.annualInvestments &&
              Boolean(formik.errors.annualInvestments)
            }
            helperText={
              formik.touched.annualInvestments &&
              formik.errors.annualInvestments
            }
          />
        </Grid>
      </Grid>
      <CustomDivider />
      <Typography variant="h5" sx={{ color: "#ffb942" }}>
        Fixed Outflows
      </Typography>
      <Grid container spacing={2} mt={0.51}>
        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            name="mortgagePayAnnually"
            label="Mortage Payment Annually"
            type="number"
            value={formik.values.mortgagePayAnnually}
            onChange={(e) =>
              handleFieldChange("mortgagePayAnnually", e.target.value)
            }
            InputProps={{
              style: { color: "#ffb942" },
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            name="loansPayAnnually"
            label="Loans Payment Annually"
            type="number"
            value={formik.values.loansPayAnnually}
            onChange={(e) =>
              handleFieldChange("loansPayAnnually", e.target.value)
            }
            InputProps={{
              style: { color: "#ffb942" },
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            name="payForInsuranceAnnually"
            label="Payment For Insurance Annually"
            type="number"
            value={formik.values.payForInsuranceAnnually}
            onChange={(e) =>
              handleFieldChange("payForInsuranceAnnually", e.target.value)
            }
            InputProps={{
              style: { color: "#ffb942" },
            }}
          />
        </Grid>
      </Grid>
      <CustomDivider />
      <Typography variant="h5" sx={{ color: "#ffb942" }}>
        Variable Outflows
      </Typography>
      <Grid container spacing={2} mt={0.51}>
        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            name="payForMiscellaniousAnnually"
            label="Payment for Miscellaneous Annually"
            type="number"
            value={formik.values.payForMiscellaniousAnnually}
            onChange={(e) =>
              handleFieldChange("payForMiscellaniousAnnually", e.target.value)
            }
            InputProps={{
              style: { color: "#ffb942" },
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            name="giveForFamilyBlessingsAnnually"
            label="Family Blessings Annually"
            type="number"
            value={formik.values.giveForFamilyBlessingsAnnually}
            onChange={(e) =>
              handleFieldChange(
                "giveForFamilyBlessingsAnnually",
                e.target.value
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
            name="payForHouseholdAnnually"
            label="Payment for Household Annually"
            type="number"
            value={formik.values.payForHouseholdAnnually}
            onChange={(e) =>
              handleFieldChange("payForHouseholdAnnually", e.target.value)
            }
            InputProps={{
              style: { color: "#ffb942" },
            }}
            error={
              formik.touched.payForHouseholdAnnually &&
              Boolean(formik.errors.payForHouseholdAnnually)
            }
            helperText={
              formik.touched.payForHouseholdAnnually &&
              formik.errors.payForHouseholdAnnually
            }
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            name="payForTransportAnnually"
            label="Payment for Transport Annually"
            type="number"
            value={formik.values.payForTransportAnnually}
            onChange={(e) =>
              handleFieldChange("payForTransportAnnually", e.target.value)
            }
            InputProps={{
              style: { color: "#ffb942" },
            }}
            error={
              formik.touched.payForTransportAnnually &&
              Boolean(formik.errors.payForTransportAnnually)
            }
            helperText={
              formik.touched.payForTransportAnnually &&
              formik.errors.payForTransportAnnually
            }
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            name="payForDependenstAnnually"
            label="Payment for Dependents Annually"
            type="number"
            value={formik.values.payForDependenstAnnually}
            onChange={(e) =>
              handleFieldChange("payForDependenstAnnually", e.target.value)
            }
            InputProps={{
              style: { color: "#ffb942" },
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            name="payForPersonalExpensesAnnually"
            label="Payment for Personal Expenses Annually"
            type="number"
            value={formik.values.payForPersonalExpensesAnnually}
            onChange={(e) =>
              handleFieldChange(
                "payForPersonalExpensesAnnually",
                e.target.value
              )
            }
            InputProps={{
              style: { color: "#ffb942" },
            }}
            error={
              formik.touched.payForPersonalExpensesAnnually &&
              Boolean(formik.errors.payForPersonalExpensesAnnually)
            }
            helperText={
              formik.touched.payForPersonalExpensesAnnually &&
              formik.errors.payForPersonalExpensesAnnually
            }
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            name="payForMedicalAnnually"
            label="Payment for Medical Annually"
            type="number"
            value={formik.values.payForMedicalAnnually}
            onChange={(e) =>
              handleFieldChange("payForMedicalAnnually", e.target.value)
            }
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

export default CashFlowStatementForm;
