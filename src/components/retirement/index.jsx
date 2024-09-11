import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";
import { CustomTextField } from "../Fields";
import Cookies from "js-cookie";
import axios from "axios";

const RetirementForm = ({ onBack }) => {
  const formik = useFormik({
    initialValues: {
      retirementAge: "",
      monthlyNeed: "",
      // needFinancialAdvisor: "No",
    },
    validationSchema: Yup.object({
      retirementAge: Yup.string().required("Retirement Age is required"),
      monthlyNeed: Yup.string().required("Monthly Need is required"),
      // needFinancialAdvisor: Yup.string().required("Value is required"),
    }),
    onSubmit: (values) => {
      // Save form data to cookies
      Cookies.set("retirementData", JSON.stringify(values), {
        expires: 7,
      });

      submitForm();
    },
  });

  const submitForm = () => {
    const personalData = JSON.parse(Cookies.get("personalFormData"));
    const employmentData = JSON.parse(Cookies.get("employmentStatusFormData"));
    const goalData = JSON.parse(Cookies.get("goalFormData"));
    const newWorthData = JSON.parse(Cookies.get("netWorthFormData"));
    const loansData = JSON.parse(Cookies.get("loanFormData"));
    const centralProvidentFundsData = JSON.parse(
      Cookies.get("centralProvidentFundsFormData")
    );
    const cashFlowData = JSON.parse(Cookies.get("cashFlowStatementFormData"));
    const insuranceData = JSON.parse(Cookies.get("insuranceFormData"));
    const dependentsData = JSON.parse(Cookies.get("dependentsFormData"));
    const retirementData = JSON.parse(Cookies.get("retirementData"));
    const willData = JSON.parse(Cookies.get("WillFormData"));

    let arr = [];
    let personalDataKeys = [
      "name",
      "lastname",
      "phone",
      "email",
      "dateOfBirth",
      "gender",
      "address",
      "address2",
      "city",
      "state",
      "postalcode",
      "country",
      "gender",
      "nationality",
    ];

    personalDataKeys.forEach((d) => {
      if (personalData[d] !== undefined) {
        arr.push(personalData[d]);
      } else {
        arr.push("");
      }
    });

    let employmenetDataKeys = [
      "status",
      "occupation",
      "company",
      "yearsInCompany",
    ];

    employmenetDataKeys.forEach((d) => {
      if (employmentData[d] !== undefined) {
        arr.push(employmentData[d]);
      } else {
        arr.push("");
      }
    });

    Object.keys(goalData).forEach((d) => {
      for (let i = 0; i < 4; i++) {
        if (goalData[d][i] !== undefined) {
          arr.push(goalData[d][i].description);
          arr.push(goalData[d][i].targetDate);
          arr.push(goalData[d][i].amount);
        } else {
          arr.push("");
          arr.push("");
          arr.push("");
        }
      }
    });

    let netWorthFormDataKeys = [
      "currentValueOfResidence",
      "currentValueOfVehicle",
      "currentSavings",
      "currentValueOfFixedDeposits",
      "anyInvestments",
      "bond",
      "unitTrusts",
      "stocks",
      "insurancePolicies",
      "realEstate",
      "commodities",
      "cryptocurrencies",
      "otherInvestments",
      "valueOfBonds",
      "valueOfUnitTrusts",
      "valueOfEquities",
      "valueOfInsurancePolicies",
      "valueOfCommodities",
      "valueOfProperties",
      "valueOfCryptocurrencies",
      "valueOfOtherInvestments",
      "currentValueOfOrdinaryCPF",
      "currentValueOfSpecialCPF",
      "currentValueOfMedisaveCPF",
      "currentValueOfOtherCPF",
    ];

    netWorthFormDataKeys.forEach((d) => {
      if (newWorthData[d] !== undefined) {
        arr.push(newWorthData[d]);
      } else {
        arr.push("");
      }
    });

    let loansDataKeys = [
      "hasLongTermLoans",
      "remainingLoan",
      "remainingRenovationLoan",
      "remainingVehicleLoan",
      "remainingStudyLoan",
      "hasShortTermLoan",
      "remainingCreditCardsLoan",
      "remainingPersonalDebitLoan",
      "incomeTaxLastYear",
    ];

    loansDataKeys.forEach((d) => {
      if (loansData[d] !== undefined) {
        arr.push(loansData[d]);
      } else {
        arr.push("");
      }
    });

    arr.push(centralProvidentFundsData["careShield"]);
    arr.push(centralProvidentFundsData["doneYourNominations"]);

    let cashFlowDataKeys = [
      "annualSalary",
      "annualBonus",
      "annualInvestmentIncome",
      "rentalIncomeAnnual",
      "otherIncomeAnnual",
      "annualSavings",
      "annualInvestments",
      "mortgagePayAnnually",
      "mortgagePayAnnually", //baad main delete karna
      "loansPayAnnually",
      "payForInsuranceAnnually",
      "payForHouseholdAnnually",
      "payForTransportAnnually",
      "payForDependenstAnnually",
      "payForPersonalExpensesAnnually",
      "payForMedicalAnnually",
      "payForMiscellaniousAnnually",
      "giveForFamilyBlessingsAnnually",
    ];

    cashFlowDataKeys.forEach((d) => {
      if (cashFlowData[d] !== undefined) {
        arr.push(cashFlowData[d]);
      } else {
        arr.push("");
      }
    });

    // let insuranceDataKeys = ["hasInsurance"];

    arr.push(insuranceData["hasInsurance"]);

    for (let i = 0; i < 4; i++) {
      if (insuranceData["hospitilizationInsurance"][i] !== undefined) {
        arr.push(insuranceData["hospitilizationInsurance"][i].provider);
        arr.push(insuranceData["hospitilizationInsurance"][i].planName);
        arr.push(
          insuranceData["hospitilizationInsurance"][i]
            .hospitilizationAssuranceAmount
        );
        arr.push(insuranceData["hospitilizationInsurance"][i].cashRider);
        arr.push(insuranceData["hospitilizationInsurance"][i].policyNumber);
        arr.push(insuranceData["hospitilizationInsurance"][i].annualPayment);
        arr.push(insuranceData["hospitilizationInsurance"][i].annualPaymentCPF);
      } else {
        arr.push("");
        arr.push("");
        arr.push("");
        arr.push("");
        arr.push("");
        arr.push("");
        arr.push("");
      }
    }

    for (let i = 0; i < 4; i++) {
      if (insuranceData["personalAccident"][i] !== undefined) {
        arr.push(insuranceData["personalAccident"][i].provider);
        arr.push(insuranceData["personalAccident"][i].planName);
        arr.push(insuranceData["personalAccident"][i].policyNumber);
        arr.push(insuranceData["personalAccident"][i].annualPayment);
      } else {
        arr.push("");
        arr.push("");
        arr.push("");
        arr.push("");
      }
    }

    for (let i = 0; i < 4; i++) {
      if (insuranceData["earlyAndCriticalIllness"][i] !== undefined) {
        arr.push(insuranceData["earlyAndCriticalIllness"][i].provider);
        arr.push(insuranceData["earlyAndCriticalIllness"][i].planName);
        arr.push(insuranceData["earlyAndCriticalIllness"][i].policyNumber);
        arr.push(
          insuranceData["earlyAndCriticalIllness"][i].earlyIllnessSumAssured
        );
        arr.push(
          insuranceData["earlyAndCriticalIllness"][i].criticalIllnessSumAssured
        );
        arr.push(insuranceData["earlyAndCriticalIllness"][i].annualPayment);
      } else {
        arr.push("");
        arr.push("");
        arr.push("");
        arr.push("");
        arr.push("");
        arr.push("");
      }
    }

    for (let i = 0; i < 4; i++) {
      if (insuranceData["lifeInsurance"][i] !== undefined) {
        arr.push(insuranceData["lifeInsurance"][i].provider);
        arr.push(insuranceData["lifeInsurance"][i].planName);
        arr.push(insuranceData["lifeInsurance"][i].policyNumber);
        arr.push(insuranceData["lifeInsurance"][i].lifeSumAssured);
        arr.push(insuranceData["lifeInsurance"][i].annualPayment);
      } else {
        arr.push("");
        arr.push("");
        arr.push("");
        arr.push("");
        arr.push("");
      }
    }

    // let dependentsDataKeys=[];

    // for (let i = 0; i < 4; i++) {
    //   if (i === 0) {
    //     if (dependentsData.dependents[i].dependentName !== "") {
    //       arr.push("Yes");
    //       arr.push(dependentsData.dependents.length);
    //     } else {
    //       arr.push("No");
    //       arr.push(0);
    //     }
    //   }

    if (dependentsData.anyDependents === "No") {
      arr.push("No");
      arr.push(dependentsData.noOfChild);
      arr.push(0);
    } else {
      arr.push("Yes");
      arr.push("");
      arr.push(dependentsData.dependents.length);
    }

    console.log("786 dependentsData", dependentsData);

    for (let i = 0; i < 4; i++) {
      // if (i === 0) {
      //   if (dependentsData.dependents[i].dependentName !== "") {
      //     arr.push("Yes");
      //     arr.push(dependentsData.dependents.length);
      //   } else {
      //     arr.push("No");
      //     arr.push(0);
      //   }
      // }

      if (
        dependentsData.dependents[i] !== undefined &&
        dependentsData.anyDependents === "Yes"
      ) {
        arr.push(dependentsData.dependents[i].dependentName);
        arr.push(dependentsData.dependents[i].dependentDateBirth);
        arr.push(dependentsData.dependents[i].dependentAnnualSpending);
        arr.push(dependentsData.dependents[i].years);
      } else {
        arr.push("");
        arr.push("");
        arr.push("");
        arr.push("");
      }
    }

    arr.push(willData.leaveWill);
    if (willData.leaveWill.localeCompare("No") !== 0) {
      arr.push(willData.nric);
    }

    for (let i = 0; i < 2; i++) {
      if (
        willData["executors"][i] !== undefined &&
        willData.leaveWill.localeCompare("No") !== 0
      ) {
        arr.push(willData["executors"][i].name);
        arr.push(willData["executors"][i].nric);
        arr.push(willData["executors"][i].address);
      } else {
        arr.push("");
        arr.push("");
        arr.push("");
      }
    }

    for (let i = 0; i < 2; i++) {
      if (
        willData["beneficiaries"][i] !== undefined &&
        willData.leaveWill.localeCompare("No") !== 0
      ) {
        arr.push(willData["beneficiaries"][i].name);
        arr.push(willData["beneficiaries"][i].nric);
        arr.push(willData["beneficiaries"][i].address);
        arr.push(willData["beneficiaries"][i].percentOfAsset);
      } else {
        arr.push("");
        arr.push("");
        arr.push("");
        arr.push("");
      }
    }

    arr.push(retirementData.retirementAge);
    arr.push(retirementData.monthlyNeed);

    // console.log("786 arr", arr);

    // console.log(
    //   "786 data",
    //   personalData,
    //   employmentData,
    //   goalData,
    //   newWorthData,
    //   loansData,
    //   centralProvidentFundsData,
    //   cashFlowData,
    //   insuranceData,
    //   dependentsData,
    //   retirementData
    // );

    let data = {
      personalData: personalData,
      employmentData: employmentData,
      goalData: goalData,
      newWorthData: newWorthData,
      loansData: loansData,
      centralProvidentFundsData: centralProvidentFundsData,
      cashFlowData: cashFlowData,
      insuranceData: insuranceData,
      dependentsData: dependentsData,
      retirementData: retirementData,
    };

    const apiUrl = `${process.env.REACT_APP_API_URL}/add-data`;

    // Make the POST request using Axios
    axios
      .post(apiUrl, arr)
      .then((response) => {
        // Handle success
        console.log("POST request successful:", response.data);
      })
      .catch((error) => {
        // Handle error
        console.error("Error making POST request:", error);
      });
  };

  // Load saved form data from cookies
  useEffect(() => {
    const formDataFromCookies = Cookies.get("retirementData");
    if (formDataFromCookies) {
      const parsedData = JSON.parse(formDataFromCookies);
      formik.setValues(parsedData);
    }
  }, []);

  const handleFieldChange = async (fieldName, value) => {
    const updatedValues = { ...formik.values, [fieldName]: value };
    await formik.setValues(updatedValues);
    setTimeout(() => {
      Cookies.set("retirementData", JSON.stringify(updatedValues), {
        expires: 7,
      });
    }, 100);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Typography variant="h4" sx={{ color: "#ffb942", mb: 2.51 }}>
        Retirement Planning
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <CustomTextField
            fullWidth
            name="retirementAge"
            label="Assuming retirement age of 65"
            type="number"
			value="65"
			readonly="readpnly"
            // value={formik.values.retirementAge}
            onChange={(e) => handleFieldChange("retirementAge", e.target.value)}
            InputProps={{
              style: { color: "#ffb942" },
            }}
            error={
              formik.touched.retirementAge &&
              Boolean(formik.errors.retirementAge)
            }
            helperText={
              formik.touched.retirementAge && formik.errors.retirementAge
            }
          />
        </Grid>
        <Grid item xs={12}>
          <CustomTextField
            fullWidth
            name="monthlyNeed"
            label="Estimated Monthly Expenditure"
            type="number"
            value={formik.values.monthlyNeed}
            onChange={(e) => handleFieldChange("monthlyNeed", e.target.value)}
            InputProps={{
              style: { color: "#ffb942" },
            }}
            error={
              formik.touched.monthlyNeed && Boolean(formik.errors.monthlyNeed)
            }
            helperText={formik.touched.monthlyNeed && formik.errors.monthlyNeed}
          />
        </Grid>
        {/* <Grid item xs={12}>
          <FormControl fullWidth required>
            <CustomInputLabel>Need Financial Advisor</CustomInputLabel>
            <CustomSelect
              name="needFinancialAdvisor"
              label="Need Financial Advisor"
              value={formik.values.needFinancialAdvisor}
              onChange={(e) =>
                handleFieldChange("needFinancialAdvisor", e.target.value)
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
        </Grid> */}
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
          Submit
        </Button>
      </Box>
    </form>
  );
};
export default RetirementForm;
