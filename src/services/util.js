import Cookies from "js-cookie";

export default function getFormDataFromCookies() {
  const personalFormData = Cookies.get("personalFormData");
  const employmentStatusFormData = Cookies.get("employmentStatusFormData");
  const goalFormData = Cookies.get("goalFormData");
  const netWorthFormData = Cookies.get("netWorthFormData");
  const loanFormData = Cookies.get("loanFormData");
  const cashFlowStatementFormData = Cookies.get("cashFlowStatementFormData");
  const centralProvidentFundsFormData = Cookies.get("centralProvidentFundsFormData");
  const insuranceFormData = Cookies.get("insuranceFormData");
  const willFormData = Cookies.get("WillFormData");
  const dependentsFormData = Cookies.get("dependentsFormData");

  console.log(centralProvidentFundsFormData);

  return {
    personal: personalFormData ? JSON.parse(personalFormData) : {},
    employmentStatus: employmentStatusFormData
      ? JSON.parse(employmentStatusFormData)
      : {},
    goals: goalFormData
      ? JSON.parse(decodeURIComponent(goalFormData))
      : { shortTermGoals: [], midTermGoals: [], longTermGoals: [] },
    netWorth: netWorthFormData
      ? JSON.parse(decodeURIComponent(netWorthFormData))
      : {},
    loanData: loanFormData ? JSON.parse(decodeURIComponent(loanFormData)) : {},
    cashFlow: cashFlowStatementFormData
      ? JSON.parse(decodeURIComponent(cashFlowStatementFormData))
      : {},
    CPF: centralProvidentFundsFormData
      ? JSON.parse(decodeURIComponent(centralProvidentFundsFormData))
      : {},
    insurance: insuranceFormData ? JSON.parse(decodeURIComponent(insuranceFormData)) : {},
    will: willFormData ? JSON.parse(decodeURIComponent(willFormData)) : {},
    dependents: dependentsFormData ? JSON.parse(decodeURIComponent(dependentsFormData)) : {},
  };
}
