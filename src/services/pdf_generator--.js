import { PDFDocument, StandardFonts, rgb, sum } from "pdf-lib";
import getFormDataFromCookies from "./util";
import template from "../template/template.pdf";
import { orange } from "@mui/material/colors";

export default async function generatePDF() {
  const { personal, employmentStatus, goals, netWorth, loanData, cashFlow, insurance, will, dependents } = getFormDataFromCookies();

  try {
    const existingPdfBytes = await fetch(template).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const personalInfoPage = pages[2];
    const shortTermPage = pages[5];
    const midTermPage = pages[6];
    const longTermPage = pages[7];
    const netWorthPage = pages[9];
    const cashFlowPage = pages[11];
    const cpfAnalysisPage = pages[14];
    const assetAllocationPage = pages[17];
    const assetAllocationPage2 = pages[18];
    const insuranceSummaryPage = pages[20];
    const debtPage = pages[21];
    // const solvencyPage = pages[23];
    const willPage1 = pages[25];
    const willPage2 = pages[26];
    const insuranceCalc = pages[27]
    const investmentsRec = pages[30]

    const fontSize = 12;
    const white = rgb(1, 1, 1);
    const black = rgb(0, 0, 0);
    const orange = rgb(0.97, 0.6, 0.1098);

    const totalTangible = Number(netWorth.currentSavings) + Number(netWorth.currentValueOfFixedDeposits);
    const totalInvestmentAssets = Number(netWorth.valueOfCommodities) + Number(netWorth.valueOfOtherInvestments) + Number(netWorth.valueOfCryptocurrencies) + Number(netWorth.valueOfProperties) + Number(netWorth.valueOfInsurancePolicies) + Number(netWorth.valueOfUnitTrusts) + Number(netWorth.valueOfBonds) + Number(netWorth.valueOfEquities);
    const totalAccount = (Number(netWorth.currentValueOfOtherCPF || 0)) + (Number(netWorth.currentValueOfMedisaveCPF || 0)) + (Number(netWorth.currentValueOfSpecialCPF || 0)) + (Number(netWorth.currentValueOfOrdinaryCPF || 0));
    const totalCashAsset = Number(cashFlow.annualSavings) + Number(cashFlow.annualInvestments);

    const totalAssets = 5000
    const totalLiabilities = 1000

    // const imageUrl = `https://quickchart.io/chart?c={type:%27bar%27,data:{labels:[%27Total%20Assets%27,%20%27Total%20Liabilities%27],datasets:[{label:%27Financial%20Overview%27,data:[${totalAssets},${totalLiabilities}],backgroundColor:[%27rgba(255,165,0,0.7)%27,%27rgba(0,0,0,0.7)%27]}]}}&width=350&height=500&format=png`;
    const imageUrl = `https://quickchart.io/chart?c=%7B%22type%22%3A%22bar%22%2C%22data%22%3A%7B%22labels%22%3A%5B%22Total%20Assets%22%2C%22Total%20Liabilities%22%5D%2C%22datasets%22%3A%5B%7B%22label%22%3Afalse%2C%22data%22%3A%5B${totalAssets}%2C${totalLiabilities}%5D%2C%22backgroundColor%22%3A%5B%22rgba(255%2C165%2C0%2C0.7)%22%2C%22rgba(0%2C0%2C0%2C0.7)%22%5D%7D%5D%7D%2C%22options%22%3A%7B%22legend%22%3A%7B%22display%22%3Afalse%7D%2C%22tooltips%22%3A%7B%22callbacks%22%3A%7B%22label%22%3Afunction(tooltipItem)%7Breturn%20tooltipItem.yLabel%3B%7D%7D%7D%2C%22scales%22%3A%7B%22yAxes%22%3A%5B%7B%22ticks%22%3A%7B%22beginAtZero%22%3Atrue%2C%22userCallback%22%3Afunction(value%2Cindex%2Cvalues)%7Bvalue%3Dvalue.toString()%3Bvalue%3Dvalue.split(%2F(%3F%3D(%3F%3A...)*%24)%2F)%3Bvalue%3Dvalue.join(%27%2C%27)%3Breturn%20value%3B%7D%7D%7D%5D%2C%22xAxes%22%3A%5B%7B%22ticks%22%3A%7B%7D%7D%5D%7D%7D%7D&width=350&height=500&format=png`;
    const chartImg = await fetch(imageUrl).then((res) => res.arrayBuffer());

    const chartImage = await pdfDoc.embedPng(chartImg);
    const chartImageDims = chartImage.scale(0.35);
    const { width, height } = chartImageDims;

    netWorthPage.drawImage(chartImage, {
      x: 320,
      y: 80,
      width: width,
      height: height,
    });

    const cpfAnnuities = netWorth.currentValueOfSpecialCPF;
    const equities = netWorth.valueOfEquities;
    const saving = netWorth.currentSavings;
    const fixedDeposits = netWorth.currentValueOfFixedDeposits;
    const unitTrusts = netWorth.valueOfUnitTrusts;
    const bonds = netWorth.valueOfBonds;
    const cpfOA = netWorth.currentValueOfOrdinaryCPF;
    const cpfMd = netWorth.currentValueOfMedisaveCPF;


    const chartConfig = encodeURIComponent(JSON.stringify({
      type: 'pie',
      data: {
        // labels: ['CPF Annuities', 'Savings', 'Equities', 'Fixed Deposits', 'Unit Trusts', 'Bonds', 'CPF OA', 'CPF MD'],
        datasets: [{
          data: [cpfAnnuities, saving, equities, fixedDeposits, unitTrusts, bonds, cpfOA, cpfMd],
          backgroundColor: ['#71c287', '#4285f4', '#34a853', '#ea4335', '#fbbc04', '#ff6d01', '#fcd04f', '#ff994d']
        }]
      },
      options: {
        plugins: {
          datalabels: { display: false }
        }
      }
    }));

    const chartUrl = `https://quickchart.io/chart?v=2.9.4&c=${chartConfig}`;

    // const chartImageUrl = `https://quickchart.io/chart?c=${chartData}&width=350&height=500&format=png`;
    const pieChartImg = await fetch(chartUrl).then((res) => res.arrayBuffer());

    const pieChartImage = await pdfDoc.embedPng(pieChartImg);
    const pieChartImageDims = pieChartImage.scale(0.5);

    assetAllocationPage2.drawImage(pieChartImage, {
      x: 50,
      y: 400,
      width: pieChartImageDims.width,
      height: pieChartImageDims.height,
    });



    const drawText = (page, text, x, y, size = fontSize, color = black, font = undefined, linespacing = 0, useCommaSeparation = true) => {
      let displayText = (text !== undefined && text.trim() !== "" && text !== "$" && text !== 'undefined' && text !== '$undefined') ? text : "-";

      // Check if the text is a number
      if (!isNaN(displayText.replace("$", "")) && useCommaSeparation) {
        if (displayText.includes("$")) {
          displayText = "$" + parseFloat(displayText.replace("$", "")).toLocaleString();
        } else {
          displayText = parseFloat(displayText).toLocaleString();
        }
      }

      const options = { x, y, size, color };
      if (font) options.font = font;
      page.drawText(displayText, options);
      return y - linespacing;
    };

    const drawPersonalInfo = () => {
      let y = 492;
      const x = 191;
      const lineSpacing = 18;

      y = drawText(personalInfoPage, personal.name, x, y, fontSize, white, undefined, lineSpacing);
      y = drawText(personalInfoPage, personal.lastname, x, y, fontSize, white, undefined, lineSpacing);
      y = drawText(personalInfoPage, new Date(personal.dateOfBirth).toLocaleDateString(), x, y, fontSize, white, undefined, lineSpacing);
      y = drawText(personalInfoPage, personal.gender, x, y, fontSize, white, undefined, lineSpacing);
      y = drawText(personalInfoPage, personal.email, x, y, fontSize, white, undefined, lineSpacing);
      y = drawText(personalInfoPage, personal.phone, x, y, fontSize, white, undefined, lineSpacing, false);

      y = 355;
      y = drawText(personalInfoPage, personal.address, x, y, fontSize, white, undefined, lineSpacing);
      y = drawText(personalInfoPage, personal.postalCode, x, y, fontSize, white, undefined, lineSpacing, false);
      y = drawText(personalInfoPage, personal.country, x, y, fontSize, white, undefined, lineSpacing);
      y = drawText(personalInfoPage, personal.maritalStatus, x, y, fontSize, white, undefined, lineSpacing);

      y = 180;
      y = drawText(personalInfoPage, employmentStatus.status, x, y, fontSize, white, undefined, lineSpacing);
      y = drawText(personalInfoPage, employmentStatus.occupation, x, y, fontSize, white, undefined, lineSpacing);
      y = drawText(personalInfoPage, employmentStatus.company, x, y, fontSize, white, undefined, lineSpacing);
      drawText(personalInfoPage, employmentStatus.yearsInCompany, x, y, fontSize, white, undefined, lineSpacing, false);
    };

    const drawGoals = (page, goals, x, startY, lineSpacing = 18, detailSpacing = 14) => {
      let y = startY;
      goals.forEach((goal) => {
        y = drawText(page, goal.description, x + 20, y, fontSize, black, undefined, detailSpacing);
        y = drawText(page, `By ${new Date(goal.targetDate).getFullYear()}`, x + 20, y, fontSize, black, undefined, detailSpacing);
        y = drawText(page, `$${goal.amount}`, x + 20, y, fontSize, black, undefined, lineSpacing);
      });
    };


    const drawNetWorth = async () => {
      const currentValueOfResidence = parseFloat(netWorth.currentValueOfResidence || 0);
      const currentValueOfVehicle = parseFloat(netWorth.currentValueOfVehicle || 0);
      const totalTangible = currentValueOfResidence + currentValueOfVehicle;
      let x = 200;
      let y = 612;
      const lineSpacing = 11;

      y = drawText(netWorthPage, `$${currentValueOfResidence}`, x, y, 9, black, undefined, lineSpacing, true);
      y = drawText(netWorthPage, `$${currentValueOfVehicle}`, x, y, 9, black, undefined, lineSpacing + 2, true);
      y = drawText(netWorthPage, `$${totalTangible}`, x, y, 9, black, helveticaBold, lineSpacing + 37, true);
      y = drawText(netWorthPage, `$${netWorth.currentSavings}`, x, y, 9, black, undefined, lineSpacing);
      y = drawText(netWorthPage, `$${netWorth.currentValueOfFixedDeposits}`, x, y, 9, black, undefined, lineSpacing);

      const totalCashAsset = Number(netWorth.currentValueOfFixedDeposits) + Number(netWorth.currentSavings);
      y = drawText(netWorthPage, `$${totalCashAsset}`, x, y, 9, black, helveticaBold, lineSpacing + 37);
      y = drawText(netWorthPage, `$${netWorth.valueOfBonds}`, x, y, 9, black, undefined, lineSpacing);
      y = drawText(netWorthPage, `$${netWorth.valueOfUnitTrusts}`, x, y, 9, black, undefined, lineSpacing);
      y = drawText(netWorthPage, `$${netWorth.valueOfStocks}`, x, y, 9, black, undefined, lineSpacing);
      y = drawText(netWorthPage, `$${netWorth.valueOfCommodities}`, x, y, 9, black, undefined, lineSpacing);
      y = drawText(netWorthPage, `$${netWorth.valueOfInsurancePolicies}`, x, y, 9, black, undefined, lineSpacing);
      y = drawText(netWorthPage, `$${netWorth.valueOfProperties}`, x, y, 9, black, undefined, lineSpacing);
      y = drawText(netWorthPage, `$${netWorth.valueOfCryptocurrencies}`, x, y, 9, black, undefined, lineSpacing);
      y = drawText(netWorthPage, `$${netWorth.valueOfOtherInvestments}`, x, y, 9, black, undefined, lineSpacing);

      const totalInvestmentAssets =
        Number(netWorth.valueOfCommodities || 0) +
        Number(netWorth.valueOfOtherInvestments || 0) +
        Number(netWorth.valueOfCryptocurrencies || 0) +
        Number(netWorth.valueOfProperties || 0) +
        Number(netWorth.valueOfInsurancePolicies || 0) +
        Number(netWorth.valueOfUnitTrusts || 0) +
        Number(netWorth.valueOfBonds || 0) +
        Number(netWorth.valueOfStocks || 0);

      y = drawText(netWorthPage, `$${totalInvestmentAssets}`, x, y, 9, black, helveticaBold, lineSpacing + 39);
      y = drawText(netWorthPage, `$${netWorth.currentValueOfOrdinaryCPF}`, x, y, 9, black, undefined, lineSpacing);
      y = drawText(netWorthPage, `$${netWorth.currentValueOfSpecialCPF}`, x, y, 9, black, undefined, lineSpacing);
      y = drawText(netWorthPage, `$${netWorth.currentValueOfMedisaveCPF}`, x, y, 9, black, undefined, lineSpacing);
      y = drawText(netWorthPage, `$${netWorth.currentValueOfOtherCPF}`, x, y, 9, black, undefined, lineSpacing);

      const totalAccount =
        (Number(netWorth.currentValueOfOtherCPF || 0)) +
        (Number(netWorth.currentValueOfMedisaveCPF || 0)) +
        (Number(netWorth.currentValueOfSpecialCPF || 0)) +
        (Number(netWorth.currentValueOfOrdinaryCPF || 0));

      y = drawText(netWorthPage, `$${totalAccount}`, x, y, 9, black, helveticaBold, lineSpacing);
      const totalAssets = totalTangible + totalInvestmentAssets + totalAccount  + totalCashAsset ;

      y -= 15;
      y = drawText(netWorthPage, `$${totalAssets}`, x, y, 13, black, helveticaBold, lineSpacing);

      x = 500;
      y = 617;
      y = drawText(netWorthPage, `$${loanData.remainingRenovationLoan}`, x, y, 9, black, undefined, lineSpacing);
      y = drawText(netWorthPage, `$${loanData.remainingVehicleLoan}`, x, y, 9, black, undefined, lineSpacing);
      y = drawText(netWorthPage, `$${loanData.remainingStudyLoan}`, x, y, 9, black, undefined, lineSpacing);
      y = drawText(netWorthPage, `$${loanData.mortgage}`, x, y, 9, black, undefined, lineSpacing);
      y = drawText(netWorthPage, `$${loanData.mortgage}`, x, y, 9, black, undefined, lineSpacing + 10);

      const totalLTLiabilities = Number(loanData.mortgage || 0) + Number(loanData.remainingHouseLoan || 0) + Number(loanData.remainingVehicleLoan || 0);

      y = drawText(netWorthPage, `$${totalLTLiabilities}`, x, y, 9, black, helveticaBold, lineSpacing + 32);
      y = drawText(netWorthPage, `$${loanData.remainingCreditCardsLoan}`, x, y, 9, black, undefined, lineSpacing);
      y = drawText(netWorthPage, `$${loanData.remainingPersonalDebitLoan}`, x, y, 9, black, undefined, lineSpacing);
      y = drawText(netWorthPage, `$${loanData.incomeTaxLastYear}`, x, y, 9, black, undefined, lineSpacing);

      const totalSTLiabilities =
        Number(loanData.remainingStudyLoan || 0) +
        Number(loanData.remainingHouseLoan || 0) +
        Number(loanData.remainingPersonalDebitLoan || 0) +
        Number(loanData.remainingCreditCardsLoan || 0);

      y -= 12;
      y = drawText(netWorthPage, `$${totalSTLiabilities}`, x, y, 9, black, helveticaBold, lineSpacing + 11);
      x = 200;
      y = 176;
      y = drawText(netWorthPage, `$${totalAssets}`, x, y, 15, black, undefined, lineSpacing + 12);

      const netWorthAmount = Number(totalAssets) - (Number(totalLTLiabilities) + Number(totalSTLiabilities));

      y = drawText(netWorthPage, `$${Number(totalLTLiabilities) + Number(totalSTLiabilities)}`, x, y, 15, black, undefined, lineSpacing + 40);
      drawText(netWorthPage, `$${netWorthAmount}`, x, y, 20, black, helveticaBold, 0);


    };

    const drawCashFlow = () => {
      let x = 350;
      let y = 662;
      const lineSpacing = 12;

      y = drawText(cashFlowPage, `$${cashFlow.annualSalary}`, x, y, 9, black, undefined, lineSpacing);
      y = drawText(cashFlowPage, `$${cashFlow.annualBonus}`, x, y, 9, black, undefined, lineSpacing);
      y = drawText(cashFlowPage, ``, x, y, 9, black, undefined, lineSpacing);
      y = drawText(cashFlowPage, ``, x, y, 9, black, undefined, lineSpacing);
      y = drawText(cashFlowPage, `$${cashFlow.annualInvestmentIncome}`, x, y, 9, black, undefined, lineSpacing);
      y = drawText(cashFlowPage, `$${cashFlow.rentalIncomeAnnual}`, x, y, 9, black, undefined, lineSpacing);
      y = drawText(cashFlowPage, `$${cashFlow.otherIncomeAnnual}`, x, y, 9, black, undefined, lineSpacing);

      const totalInflow =
        Number(cashFlow.annualSalary) +
        Number(cashFlow.annualBonus) +
        Number(cashFlow.annualInvestmentIncome) +
        Number(cashFlow.rentalIncomeAnnual) +
        Number(cashFlow.otherIncomeAnnual);

      y -= 12;
      y = drawText(cashFlowPage, `$${totalInflow}`, x, y, 9, black, helveticaBold, lineSpacing + 10);
      x -= 150;
      y -= 107;
      y = drawText(cashFlowPage, `$${cashFlow.annualSavings}`, x, y, 9, white, undefined, lineSpacing);
      y = drawText(cashFlowPage, ``, x, y, 9, white, undefined, lineSpacing);
      y = drawText(cashFlowPage, `$${cashFlow.annualInvestments}`, x, y, 9, white, undefined, lineSpacing);
      y = drawText(cashFlowPage, ``, x, y, 9, white, undefined, lineSpacing);
      y = drawText(cashFlowPage, ``, x, y, 9, white, undefined, lineSpacing);


      const totalSIOutflow = Number(cashFlow.annualSavings) + Number(cashFlow.annualInvestments);
      y -= 10;
      y = drawText(cashFlowPage, `$${totalSIOutflow}`, x, y, 9, white, helveticaBold, lineSpacing + 10);
      x += 190;
      y -= 107;
      y = drawText(cashFlowPage, `$${cashFlow.payForHouseholdAnnually}`, x, y, 9, white, undefined, lineSpacing);
      y = drawText(cashFlowPage, `$${cashFlow.payForTransportAnnually}`, x, y, 9, white, undefined, lineSpacing);
      y = drawText(cashFlowPage, `$${cashFlow.payForDependenstAnnually}`, x, y, 9, white, undefined, lineSpacing);
      y = drawText(cashFlowPage, `$${cashFlow.payForPersonalExpensesAnnually}`, x, y, 9, white, undefined, lineSpacing);
      y = drawText(cashFlowPage, `$${cashFlow.payForMedicalAnnually}`, x, y, 9, white, undefined, lineSpacing);
      y = drawText(cashFlowPage, `$${cashFlow.payForMiscellaniousAnnually}`, x, y, 9, white, undefined, lineSpacing);
      y = drawText(cashFlowPage, `$${cashFlow.giveForFamilyBlessingsAnnually}`, x, y, 9, white, undefined, lineSpacing);
      y = drawText(cashFlowPage, ``, x, y, 9, white, undefined, lineSpacing);

      const totalOutflow =
        Number(cashFlow.payForHouseholdAnnually) +
        Number(cashFlow.payForTransportAnnually) +
        Number(cashFlow.payForDependenstAnnually) +
        Number(cashFlow.payForPersonalExpensesAnnually) +
        Number(cashFlow.payForMedicalAnnually) +
        Number(cashFlow.payForMiscellaniousAnnually) +
        Number(cashFlow.giveForFamilyBlessingsAnnually);

      y = drawText(cashFlowPage, `$${totalOutflow}`, x, y, 9, white, helveticaBold, lineSpacing + 9);

      x += 80;
      y += 336;
      y = drawText(cashFlowPage, `$${cashFlow.mortgagePayAnnually}`, x, y, 9, white, undefined, lineSpacing - 2);
      const CRSLoan = Number(loanData.remainingVehicleLoan) + Number(loanData.remainingRenovationLoan) + Number(loanData.remainingStudyLoan);
      y = drawText(cashFlowPage, `$${CRSLoan}`, x, y, 9, white, undefined, lineSpacing - 2);
      y = drawText(cashFlowPage, `$${cashFlow.payForInsuranceAnnually}`, x, y, 9, white, undefined, lineSpacing - 2);

      const totalFixedOutflow = Number(cashFlow.mortgagePayAnnually) + Number(CRSLoan) + Number(cashFlow.payForInsuranceAnnually) + Number(loanData.incomeTaxLastYear);

      y -= 15;
      y = drawText(cashFlowPage, `$${totalFixedOutflow}`, x, y, 9, white, helveticaBold, lineSpacing);

      const netInflow = totalInflow - (totalSIOutflow + totalOutflow + totalFixedOutflow);

      y = 70;
      x -= 190;
      if (netInflow < 0) {
        drawText(cashFlowPage, `${netInflow}`, x, y, 25, black, helveticaBold, lineSpacing);
      } else {
        drawText(cashFlowPage, `${netInflow}`, x, y, 25, orange, helveticaBold, lineSpacing);
      }

    };

    const drawCPFAnalysis = () => {
      let x = 300;
      let y = 488;
      const lineSpacing = 23;

      function getPercentagesByDOB(dateOfBirth) {
        const data = [
          { ageGroup: "35 & Below", OA: 23.0, SA: 6.0, MA: 8.0 },
          { ageGroup: "Above 35 to 45", OA: 21.0, SA: 7.0, MA: 9.0 },
          { ageGroup: "Above 45 to 50", OA: 19.0, SA: 8.0, MA: 10.0 },
          { ageGroup: "Above 50 to 55", OA: 15.0, SA: 11.5, MA: 10.5 },
          { ageGroup: "Above 55 to 60", OA: 12.0, SA: 3.5, MA: 10.5 },
          { ageGroup: "Above 60 to 65", OA: 3.5, SA: 2.5, MA: 10.5 },
          { ageGroup: "Above 65", OA: 1.0, SA: 1.0, MA: 10.5 },
          { ageGroup: "Others", OA: 0.0, SA: 0.0, MA: 0.0 }
        ];

        function calculateAge(dateOfBirth) {
          const dob = new Date(dateOfBirth);
          const diffMs = Date.now() - dob.getTime();
          const ageDt = new Date(diffMs);

          return Math.abs(ageDt.getUTCFullYear() - 1970);
        }

        const age = calculateAge(dateOfBirth);

        let ageGroup = "Others";
        if (age <= 35) {
          ageGroup = "35 & Below";
        } else if (age <= 45) {
          ageGroup = "Above 35 to 45";
        } else if (age <= 50) {
          ageGroup = "Above 45 to 50";
        } else if (age <= 55) {
          ageGroup = "Above 50 to 55";
        } else if (age <= 60) {
          ageGroup = "Above 55 to 60";
        } else if (age <= 65) {
          ageGroup = "Above 60 to 65";
        } else {
          ageGroup = "Above 65";
        }

        const result = data.find(group => group.ageGroup === ageGroup);
        return {
          QAPercentage: result.OA,
          SAPercentage: result.SA,
          MAPercentage: result.MA
        };
      }

      function getContributionRates(dob, baseAmount) {
        const rates = {
          "35 & Below": { employer: 17.0, employee: 20.0 },
          "Above 35 to 45": { employer: 17.0, employee: 20.0 },
          "Above 45 to 50": { employer: 17.0, employee: 20.0 },
          "Above 50 to 55": { employer: 17.0, employee: 20.0 },
          "Above 55 to 60": { employer: 13.0, employee: 13.0 },
          "Above 60 to 65": { employer: 9.0, employee: 7.5 },
          "Above 65": { employer: 7.5, employee: 5.0 },
          "Others": { employer: 0.0, employee: 0.0 }
        };

        function calculateAge(dob) {
          const birthDate = new Date(dob);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDifference = today.getMonth() - birthDate.getMonth();
          if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          return age;
        }

        function getAgeGroup(age) {
          if (age <= 35) return "35 & Below";
          if (age > 35 && age <= 45) return "Above 35 to 45";
          if (age > 45 && age <= 50) return "Above 45 to 50";
          if (age > 50 && age <= 55) return "Above 50 to 55";
          if (age > 55 && age <= 60) return "Above 55 to 60";
          if (age > 60 && age <= 65) return "Above 60 to 65";
          if (age > 65) return "Above 65";
          return "Others";
        }

        const age = calculateAge(dob);
        const ageGroup = getAgeGroup(age);
        const rate = rates[ageGroup];

        if (!rate) {
          throw new Error("Invalid age group calculated.");
        }

        const employerPayable = (rate.employer / 100) * baseAmount;
        const employeePayable = (rate.employee / 100) * baseAmount;

        return {
          employerPayableTOW: employerPayable.toFixed(2),
          employeePayableTOW: employeePayable.toFixed(2)
        };
      }

      const dob = personal.dateOfBirth;
      const { QAPercentage, SAPercentage, MAPercentage } = getPercentagesByDOB(dob);
      const { employerPayableTOW, employeePayableTOW } = getContributionRates(dob, cashFlow.annualSalary);

      drawText(cpfAnalysisPage, `${QAPercentage}%`, 360, y, 9, black, undefined, lineSpacing);
      drawText(cpfAnalysisPage, `${SAPercentage}%`, 435, y, 9, black, undefined, lineSpacing);
      y = drawText(cpfAnalysisPage, `${MAPercentage}%`, 515, y, 9, black, undefined, lineSpacing);
      y = drawText(cpfAnalysisPage, `$${cashFlow.annualSalary}`, 430, y, 9, black, undefined, lineSpacing);
      drawText(cpfAnalysisPage, `$${(employeePayableTOW * (QAPercentage / 100)).toFixed(2)}`, x + 60, y, 9, black, undefined, lineSpacing);
      drawText(cpfAnalysisPage, `$${(employeePayableTOW * (SAPercentage / 100)).toFixed(2)}`, x + 130, y, 9, black, undefined, lineSpacing);
      drawText(cpfAnalysisPage, `$${(employeePayableTOW * (MAPercentage / 100)).toFixed(2)}`, x + 210, y, 9, black, undefined, lineSpacing);
      y = drawText(cpfAnalysisPage, `$${employeePayableTOW}`, x, y, 9, black, undefined, lineSpacing);
      drawText(cpfAnalysisPage, `$${(employerPayableTOW * (QAPercentage / 100)).toFixed(2)}`, x + 60, y, 9, black, undefined, lineSpacing);
      drawText(cpfAnalysisPage, `$${(employerPayableTOW * (SAPercentage / 100)).toFixed(2)}`, x + 130, y, 9, black, undefined, lineSpacing);
      drawText(cpfAnalysisPage, `$${(employerPayableTOW * (MAPercentage / 100)).toFixed(2)}`, x + 210, y, 9, black, undefined, lineSpacing);
      y = drawText(cpfAnalysisPage, `$${employerPayableTOW}`, x, y, 9, black, undefined, lineSpacing);
      y = drawText(cpfAnalysisPage, `$${cashFlow.annualBonus}`, 430, y, 9, black, undefined, lineSpacing);

      let aw = Number(cashFlow.annualSalary) + Number(cashFlow.annualBonus) > 102000 ? 102000 - Number(cashFlow.annualSalary) : Number(cashFlow.annualBonus);

      y = drawText(cpfAnalysisPage, `$${aw}`, 430, y, 9, black, undefined, lineSpacing);


      const rates = getContributionRates(dob, aw);
      drawText(cpfAnalysisPage, `$${rates.employeePayableTOW}`, x, y, 9, black, undefined, lineSpacing);
      drawText(cpfAnalysisPage, `$${(rates.employeePayableTOW * (QAPercentage / 100)).toFixed(2)}`, x + 60, y, 9, black, undefined, lineSpacing);
      drawText(cpfAnalysisPage, `$${(rates.employeePayableTOW * (SAPercentage / 100)).toFixed(2)}`, x + 130, y, 9, black, undefined, lineSpacing);
      y = drawText(cpfAnalysisPage, `${(rates.employeePayableTOW * (MAPercentage / 100)).toFixed(2)}`, x + 210, y, 9, black, undefined, lineSpacing);

      drawText(cpfAnalysisPage, `$${rates.employerPayableTOW}`, x, y, 9, black, undefined, lineSpacing);

      drawText(cpfAnalysisPage, `$${(rates.employerPayableTOW * (QAPercentage / 100)).toFixed(2)}`, x + 60, y, 9, black, undefined, lineSpacing);
      drawText(cpfAnalysisPage, `$${(rates.employerPayableTOW * (SAPercentage / 100)).toFixed(2)}`, x + 130, y, 9, black, undefined, lineSpacing);
      y = drawText(cpfAnalysisPage, `${(rates.employerPayableTOW * (MAPercentage / 100)).toFixed(2)}`, x + 210, y, 9, black, undefined, lineSpacing);

      // add the cpfs

      const totalcpf1 = Number(employeePayableTOW) + Number(employerPayableTOW) + Number(rates.employeePayableTOW) + Number(rates.employerPayableTOW)
      drawText(cpfAnalysisPage, `$${totalcpf1.toFixed(2)}`, x, y, 9, white, helveticaBold, lineSpacing);

      const totalQA = (Number((employeePayableTOW * (QAPercentage / 100)).toFixed(2))
        + Number((employerPayableTOW * (QAPercentage / 100)).toFixed(2))
        + Number((rates.employeePayableTOW * (QAPercentage / 100)).toFixed(2))
        + Number((rates.employerPayableTOW * (QAPercentage / 100)).toFixed(2))).toFixed(2)

      drawText(cpfAnalysisPage, `$${Number(totalQA).toFixed(2)}`, x + 60, y, 9, white, helveticaBold, lineSpacing);

      const totalSA = (Number((employeePayableTOW * (SAPercentage / 100)).toFixed(2))
        + Number((employerPayableTOW * (SAPercentage / 100)).toFixed(2))
        + Number((rates.employeePayableTOW * (SAPercentage / 100)).toFixed(2))
        + Number((rates.employerPayableTOW * (SAPercentage / 100)).toFixed(2))).toFixed(2)

      drawText(cpfAnalysisPage, `$${Number(totalSA).toFixed(2)}`, x + 130, y, 9, white, helveticaBold, lineSpacing);

      const totalMA = (Number((employeePayableTOW * (MAPercentage / 100)).toFixed(2))
        + Number((employerPayableTOW * (MAPercentage / 100)).toFixed(2))
        + Number((rates.employeePayableTOW * (MAPercentage / 100)).toFixed(2))
        + Number((rates.employerPayableTOW * (MAPercentage / 100)).toFixed(2))).toFixed(2)

      drawText(cpfAnalysisPage, `$${Number(totalMA).toFixed(2)}`, x + 210, y, 9, white, helveticaBold, lineSpacing);

    }

    const drawAssetAllocationPage = () => {
      let x = 210;
      let y = 657;
      const lineSpacing = 20;

      const savings = parseFloat(netWorth.currentSavings || 0);
      const fixedDeposits = parseFloat(netWorth.currentValueOfFixedDeposits || 0);
      const unitTrusts = parseFloat(netWorth.valueOfUnitTrusts || 0);
      const equities = parseFloat(netWorth.valueOfEquities || 0);
      const bonds = parseFloat(netWorth.valueOfBonds || 0);
      const insurancePolicies = parseFloat(netWorth.valueOfInsurancePolicies || 0);
      const cryptocurrencies = parseFloat(netWorth.valueOfCryptocurrencies || 0);
      const commodities = parseFloat(netWorth.valueOfCommodities || 0);
      const ordinaryCPF = parseFloat(netWorth.currentValueOfOrdinaryCPF || 0);
      const specialCPF = parseFloat(netWorth.currentValueOfSpecialCPF || 0);
      const medisaveCPF = parseFloat(netWorth.currentValueOfMedisaveCPF || 0);
      const realestate = 0;
      const others = 0;

      y = drawText(assetAllocationPage, `$${savings}`, x, y, 9, black, undefined, lineSpacing);
      y = drawText(assetAllocationPage, `$${fixedDeposits}`, x, y, 9, black, undefined, lineSpacing + 2);
      y = drawText(assetAllocationPage, `$${unitTrusts}`, x, y, 9, black, undefined, lineSpacing + 9);
      y = drawText(assetAllocationPage, `$${equities}`, x, y, 9, black, undefined, lineSpacing + 8);
      y = drawText(assetAllocationPage, `$${bonds}`, x, y, 9, black, undefined, lineSpacing + 8);
      y = drawText(assetAllocationPage, `$${insurancePolicies}`, x, y, 9, black, undefined, lineSpacing + 4);
      y = drawText(assetAllocationPage, `$${cryptocurrencies}`, x, y, 9, black, undefined, lineSpacing);
      y = drawText(assetAllocationPage, `$${commodities}`, x, y, 9, black, undefined, lineSpacing);
      y = drawText(assetAllocationPage, `$${ordinaryCPF}`, x, y, 9, black, undefined, lineSpacing + 3);
      y = drawText(assetAllocationPage, `$${specialCPF}`, x, y, 9, black, undefined, lineSpacing + 1);
      y = drawText(assetAllocationPage, `$${medisaveCPF}`, x, y, 9, black, undefined, lineSpacing);
      y = drawText(assetAllocationPage, `$`, x, y, 9, black, undefined, lineSpacing);
      y = drawText(assetAllocationPage, `$`, x, y, 9, black, undefined, lineSpacing);

      const totalPortfolio = savings + fixedDeposits + unitTrusts + equities + bonds + insurancePolicies + cryptocurrencies + commodities + ordinaryCPF + specialCPF + medisaveCPF + realestate + others;
      drawText(assetAllocationPage, `$${totalPortfolio}`, x, y, 9, white, helveticaBold, lineSpacing);

      const percentOfSavings = ((savings / totalPortfolio) * 100).toFixed(2);
      const percentOfFixedDeposits = ((fixedDeposits / totalPortfolio) * 100).toFixed(2);
      const percentOfUnitTrusts = ((unitTrusts / totalPortfolio) * 100).toFixed(2);
      const percentOfEquities = ((equities / totalPortfolio) * 100).toFixed(2);
      const percentOfBonds = ((bonds / totalPortfolio) * 100).toFixed(2);
      const percentOfInsurancePolicies = ((insurancePolicies / totalPortfolio) * 100).toFixed(2);
      const percentOfCryptocurrencies = ((cryptocurrencies / totalPortfolio) * 100).toFixed(2);
      const percentOfCommodities = ((commodities / totalPortfolio) * 100).toFixed(2);
      const percentOfOrdinaryCPF = ((ordinaryCPF / totalPortfolio) * 100).toFixed(2);
      const percentOfSpecialCPF = ((specialCPF / totalPortfolio) * 100).toFixed(2);
      const percentOfMedisaveCPF = ((medisaveCPF / totalPortfolio) * 100).toFixed(2);
      const percentOfRealestate = 0;
      const percentOfOthers = 0;


      y = 657
      x = 305
      y = drawText(assetAllocationPage, `${percentOfSavings}%`, x, y, 9, black, undefined, lineSpacing);
      y = drawText(assetAllocationPage, `${percentOfFixedDeposits}%`, x, y, 9, black, undefined, lineSpacing + 2);
      y = drawText(assetAllocationPage, `${percentOfUnitTrusts}%`, x, y, 9, black, undefined, lineSpacing + 9);
      y = drawText(assetAllocationPage, `${percentOfEquities}%`, x, y, 9, black, undefined, lineSpacing + 8);
      y = drawText(assetAllocationPage, `${percentOfBonds}%`, x, y, 9, black, undefined, lineSpacing + 8);
      y = drawText(assetAllocationPage, `${percentOfInsurancePolicies}%`, x, y, 9, black, undefined, lineSpacing + 4);
      y = drawText(assetAllocationPage, `${percentOfCryptocurrencies}%`, x, y, 9, black, undefined, lineSpacing);
      y = drawText(assetAllocationPage, `${percentOfCommodities}%`, x, y, 9, black, undefined, lineSpacing);
      y = drawText(assetAllocationPage, `${percentOfOrdinaryCPF}%`, x, y, 9, black, undefined, lineSpacing + 3);
      y = drawText(assetAllocationPage, `${percentOfSpecialCPF}%`, x, y, 9, black, undefined, lineSpacing + 1);
      y = drawText(assetAllocationPage, `${percentOfMedisaveCPF}%`, x, y, 9, black, undefined, lineSpacing);
      y = drawText(assetAllocationPage, `${percentOfRealestate}`, x, y, 9, black, undefined, lineSpacing);
      y = drawText(assetAllocationPage, `${percentOfOthers}`, x, y, 9, black, undefined, lineSpacing);

      const totalPercentOfAll = parseFloat(percentOfSavings) + parseFloat(percentOfFixedDeposits) + parseFloat(percentOfUnitTrusts) + parseFloat(percentOfEquities) + parseFloat(percentOfBonds) + parseFloat(percentOfInsurancePolicies) + parseFloat(percentOfCryptocurrencies) + parseFloat(percentOfCommodities) + parseFloat(percentOfOrdinaryCPF) + parseFloat(percentOfSpecialCPF) + parseFloat(percentOfMedisaveCPF) + parseFloat(percentOfRealestate) + parseFloat(percentOfOthers);
      drawText(assetAllocationPage, `$${totalPercentOfAll.toFixed(1)}`, x, y, 9, white, helveticaBold, lineSpacing);

      y = 657
      x = 400

      const PRRSavings = 1
      const PRRFixedDeposits = 1
      const PRRUnitTrusts = 4
      const PRREquities = 6
      const PRRBonds = 3
      const PRRInsurancePolicies = 3
      const PRRCryptocurrencies = 0 //unknown
      const PRRCommodities = 0 //unknown
      const PRROrdinaryCPF = 2.5
      const PRRSpecialCPF = 4
      const PRRMedisave = 4
      const PRRRealestate = 2
      const PRROthers = 4

      // draw the above variables
      y = drawText(assetAllocationPage, `${PRRSavings}%`, x, y, 9, black, undefined, lineSpacing);
      y = drawText(assetAllocationPage, `${PRRFixedDeposits}%`, x, y, 9, black, undefined, lineSpacing + 2);
      y = drawText(assetAllocationPage, `${PRRUnitTrusts}%`, x, y, 9, black, undefined, lineSpacing + 9);
      y = drawText(assetAllocationPage, `${PRREquities}%`, x, y, 9, black, undefined, lineSpacing + 8);
      y = drawText(assetAllocationPage, `${PRRBonds}%`, x, y, 9, black, undefined, lineSpacing + 8);
      y = drawText(assetAllocationPage, `${PRRInsurancePolicies}%`, x, y, 9, black, undefined, lineSpacing + 4);
      y = drawText(assetAllocationPage, `${PRRCryptocurrencies}%`, x, y, 9, black, undefined, lineSpacing);
      y = drawText(assetAllocationPage, `${PRRCommodities}%`, x, y, 9, black, undefined, lineSpacing);
      y = drawText(assetAllocationPage, `${PRROrdinaryCPF}%`, x, y, 9, black, undefined, lineSpacing + 3);
      y = drawText(assetAllocationPage, `${PRRSpecialCPF}%`, x, y, 9, black, undefined, lineSpacing + 1);
      y = drawText(assetAllocationPage, `${PRRMedisave}%`, x, y, 9, black, undefined, lineSpacing);
      y = drawText(assetAllocationPage, `${PRRRealestate}%`, x, y, 9, black, undefined, lineSpacing);
      drawText(assetAllocationPage, `${PRROthers}%`, x, y, 9, black, undefined, lineSpacing);

      y = 657
      x = 495

      y = drawText(assetAllocationPage, `${(percentOfSavings * (PRRSavings / 100)).toFixed(2)}%`, x, y, 9, black, undefined, lineSpacing);
      y = drawText(assetAllocationPage, `${(percentOfFixedDeposits * (PRRFixedDeposits / 100)).toFixed(2)}%`, x, y, 9, black, undefined, lineSpacing + 2);
      y = drawText(assetAllocationPage, `${(percentOfUnitTrusts * (PRRUnitTrusts / 100)).toFixed(2)}%`, x, y, 9, black, undefined, lineSpacing + 9);
      y = drawText(assetAllocationPage, `${(percentOfEquities * (PRREquities / 100)).toFixed(2)}%`, x, y, 9, black, undefined, lineSpacing + 9);
      y = drawText(assetAllocationPage, `${(percentOfBonds * (PRRBonds / 100)).toFixed(2)}%`, x, y, 9, black, undefined, lineSpacing + 8);
      y = drawText(assetAllocationPage, `${(percentOfInsurancePolicies * (PRRInsurancePolicies / 100)).toFixed(2)}%`, x, y, 9, black, undefined, lineSpacing + 4);
      y = drawText(assetAllocationPage, `${(percentOfCryptocurrencies * (PRRCryptocurrencies / 100)).toFixed(2)}%`, x, y, 9, black, undefined, lineSpacing);
      y = drawText(assetAllocationPage, `${(percentOfCommodities * (PRRCommodities / 100)).toFixed(2)}%`, x, y, 9, black, undefined, lineSpacing);
      y = drawText(assetAllocationPage, `${(percentOfOrdinaryCPF * (PRROrdinaryCPF / 100)).toFixed(2)}%`, x, y, 9, black, undefined, lineSpacing);
      y = drawText(assetAllocationPage, `${(percentOfSpecialCPF * (PRRSpecialCPF / 100)).toFixed(2)}%`, x, y, 9, black, undefined, lineSpacing + 3);
      y = drawText(assetAllocationPage, `${(percentOfMedisaveCPF * (PRRMedisave / 100)).toFixed(2)}%`, x, y, 9, black, undefined, lineSpacing + 1);
      y = drawText(assetAllocationPage, `${(percentOfRealestate * (PRRRealestate / 100)).toFixed(2)}%`, x, y, 9, black, undefined, lineSpacing);
      y = drawText(assetAllocationPage, ``, x, y, 9, black, undefined, lineSpacing);

      const totalWRR = parseFloat(
        (
          Number((percentOfSavings * (PRRSavings / 100)).toFixed(2)) +
          Number((percentOfFixedDeposits * (PRRFixedDeposits / 100)).toFixed(2)) +
          Number((percentOfEquities * (PRREquities / 100)).toFixed(2)) +
          Number((percentOfBonds * (PRRBonds / 100)).toFixed(2)) +
          Number((percentOfInsurancePolicies * (PRRInsurancePolicies / 100)).toFixed(2)) +
          Number((percentOfCryptocurrencies * (PRRCryptocurrencies / 100)).toFixed(2)) +
          Number((percentOfCommodities * (PRRCommodities / 100)).toFixed(2)) +
          Number((percentOfOrdinaryCPF * (PRROrdinaryCPF / 100)).toFixed(2)) +
          Number((percentOfSpecialCPF * (PRRSpecialCPF / 100)).toFixed(2)) +
          Number((percentOfMedisaveCPF * (PRRMedisave / 100)).toFixed(2)) +
          Number((percentOfRealestate * (PRRRealestate / 100)).toFixed(2))
        ).toFixed(2)
      );
      y = drawText(assetAllocationPage, `${totalWRR.toFixed(2)}%`, x, y, 9, white, helveticaBold, lineSpacing)
      x = 260
      y = 195
      drawText(assetAllocationPage, `${totalWRR.toFixed(2)}%`, x, y, 20, black, helveticaBold)

    }

    const drawInsuranceSummary = () => {
      let x = 157
      let y = 390
      const lineSpacing = 38

      const hospitalizationInsurer = insurance.hospitilizationInsurance[0].provider
      const personalInsurer = insurance.personalAccident[0].provider
      const eciInsurer = insurance.earlyAndCriticalIllness[0].provider
      const criticalIllnessInsurer = insurance.criticalIllness[0].provider
      const lifeInsurance = insurance.lifeInsurance[0].provider
      const totalPermanentDisability = insurance.totalPermanentDisability[0].provider

      y = drawText(insuranceSummaryPage, `${hospitalizationInsurer}`, x, y, 8, black, undefined, lineSpacing);
      y = drawText(insuranceSummaryPage, `${personalInsurer}`, x, y, 8, black, undefined, lineSpacing);
      y = drawText(insuranceSummaryPage, `${eciInsurer}`, x, y, 8, black, undefined, lineSpacing);
      y = drawText(insuranceSummaryPage, `${criticalIllnessInsurer}`, x, y, 8, black, undefined, lineSpacing);
      y = drawText(insuranceSummaryPage, `${lifeInsurance}`, x, y, 8, black, undefined, lineSpacing);
      y = drawText(insuranceSummaryPage, `${totalPermanentDisability}`, x, y, 8, black, undefined, lineSpacing);

      x = 240
      y = 390

      const hospitalizationPlanName = insurance.hospitilizationInsurance[0].planName
      const personalPlanName = insurance.personalAccident[0].planName
      const eciPlanName = insurance.earlyAndCriticalIllness[0].planName
      const criticalIllnessPlanName = insurance.criticalIllness[0].planName
      const lifeInsurancePlanName = insurance.lifeInsurance[0].planName
      const totalPermanentDisabilityPlanName = insurance.totalPermanentDisability[0].planName

      y = drawText(insuranceSummaryPage, `${hospitalizationPlanName}`, x, y, 8, black, undefined, lineSpacing);
      y = drawText(insuranceSummaryPage, `${personalPlanName}`, x, y, 8, black, undefined, lineSpacing);
      y = drawText(insuranceSummaryPage, `${eciPlanName}`, x, y, 8, black, undefined, lineSpacing);
      y = drawText(insuranceSummaryPage, `${criticalIllnessPlanName}`, x, y, 8, black, undefined, lineSpacing);
      y = drawText(insuranceSummaryPage, `${lifeInsurancePlanName}`, x, y, 8, black, undefined, lineSpacing);
      y = drawText(insuranceSummaryPage, `${totalPermanentDisabilityPlanName}`, x, y, 8, black, undefined, lineSpacing);

      const hospitalizationPolicyNumber = insurance.hospitilizationInsurance[0].policyNumber
      const personalPolicyNumber = insurance.personalAccident[0].policyNumber
      const eciPolicyNumber = insurance.earlyAndCriticalIllness[0].policyNumber
      const criticalIllnessPolicyNumber = insurance.criticalIllness[0].policyNumber
      const lifeInsurancePolicyNumber = insurance.lifeInsurance[0].policyNumber
      const totalPermanentDisabilityPolicyNumber = insurance.totalPermanentDisability[0].policyNumber

      x = 310
      y = 390

      y = drawText(insuranceSummaryPage, `${hospitalizationPolicyNumber}`, x, y, 8, black, undefined, lineSpacing, false);
      y = drawText(insuranceSummaryPage, `${personalPolicyNumber}`, x, y, 8, black, undefined, lineSpacing, false);
      y = drawText(insuranceSummaryPage, `${eciPolicyNumber}`, x, y, 8, black, undefined, lineSpacing, false);
      y = drawText(insuranceSummaryPage, `${criticalIllnessPolicyNumber}`, x, y, 8, black, undefined, lineSpacing, false);
      y = drawText(insuranceSummaryPage, `${lifeInsurancePolicyNumber}`, x, y, 8, black, undefined, lineSpacing, false);
      y = drawText(insuranceSummaryPage, `${totalPermanentDisabilityPolicyNumber}`, x, y, 8, black, undefined, lineSpacing, false);

      const hospitalizationLifeSumAssured = insurance.hospitilizationInsurance[0].lifeSumAssured
      const personalLifeSumAssured = insurance.personalAccident[0].lifeSumAssured
      const eciLifeSumAssured = insurance.earlyAndCriticalIllness[0].lifeSumAssured
      const criticalIllnessLifeSumAssured = insurance.criticalIllness[0].lifeSumAssured
      const lifeInsuranceLifeSumAssured = insurance.lifeInsurance[0].lifeSumAssured
      const totalPermanentDisabilityLifeSumAssured = insurance.totalPermanentDisability[0].totalPermanentDisabilitySumAssured

      x = 390
      y = 390

      y = drawText(insuranceSummaryPage, `${hospitalizationLifeSumAssured}`, x, y, 8, black, undefined, lineSpacing);
      y = drawText(insuranceSummaryPage, `${personalLifeSumAssured}`, x, y, 8, black, undefined, lineSpacing);
      y = drawText(insuranceSummaryPage, `${eciLifeSumAssured}`, x, y, 8, black, undefined, lineSpacing);
      y = drawText(insuranceSummaryPage, `${criticalIllnessLifeSumAssured}`, x, y, 8, black, undefined, lineSpacing);
      y = drawText(insuranceSummaryPage, `${lifeInsuranceLifeSumAssured}`, x, y, 8, black, undefined, lineSpacing);
      y = drawText(insuranceSummaryPage, `${totalPermanentDisabilityLifeSumAssured}`, x, y, 8, black, undefined, lineSpacing);

      const hospitalizationPayment = insurance.hospitilizationInsurance[0].annualPayment || 0
      const personalPayment = insurance.personalAccident[0].annualPayment || 0
      const eciPayment = insurance.earlyAndCriticalIllness[0].annualPayment || 0
      const criticalIllnessPayment = insurance.criticalIllness[0].annualPayment || 0
      const lifeInsurancePayment = insurance.lifeInsurance[0].annualPayment || 0
      const totalPermanentDisabilityPayment = insurance.totalPermanentDisability[0].annualPayment || 0

      x = 446
      y = 390

      y = drawText(insuranceSummaryPage, `${hospitalizationPayment}`, x, y, 8, black, undefined, lineSpacing);
      y = drawText(insuranceSummaryPage, `${personalPayment}`, x, y, 8, black, undefined, lineSpacing);
      y = drawText(insuranceSummaryPage, `${eciPayment}`, x, y, 8, black, undefined, lineSpacing);
      y = drawText(insuranceSummaryPage, `${criticalIllnessPayment}`, x, y, 8, black, undefined, lineSpacing);
      y = drawText(insuranceSummaryPage, `${lifeInsurancePayment}`, x, y, 8, black, undefined, lineSpacing);
      y = drawText(insuranceSummaryPage, `${totalPermanentDisabilityPayment}`, x, y, 8, black, undefined, lineSpacing + 2);

      const totalAnnualPayment = parseFloat(criticalIllnessPayment) + parseFloat(hospitalizationPayment) + parseFloat(personalPayment) + parseFloat(eciPayment) + parseFloat(lifeInsurancePayment) + parseFloat(totalPermanentDisabilityPayment);

      x = 400
      drawText(insuranceSummaryPage, `${totalAnnualPayment}`, x, y, 12, black, helveticaBold, lineSpacing)


    }

    const drawDebt = () => {
      let x = 360;
      let y = 654;

      const sumOfAllLoans = Number(loanData.mortgage) + Number(loanData.remainingHouseLoan) + Number(loanData.remainingVehicleLoan) + Number(loanData.remainingStudyLoan) + Number(loanData.remainingRenovationLoan) + Number(loanData.remainingCreditCardsLoan) + Number(loanData.remainingPersonalDebitLoan);
      const totalInflow = Number(cashFlow.annualSalary) + Number(cashFlow.annualBonus) + Number(cashFlow.annualInvestmentIncome) + Number(cashFlow.rentalIncomeAnnual) + Number(cashFlow.otherIncomeAnnual);
      const totalTangible = Number(netWorth.currentSavings) + Number(netWorth.currentValueOfFixedDeposits);
      const totalInvestmentAssets = Number(netWorth.valueOfCommodities) + Number(netWorth.valueOfOtherInvestments) + Number(netWorth.valueOfCryptocurrencies) + Number(netWorth.valueOfProperties) + Number(netWorth.valueOfInsurancePolicies) + Number(netWorth.valueOfUnitTrusts) + Number(netWorth.valueOfBonds) + Number(netWorth.valueOfEquities);
      const totalAccount = (Number(netWorth.currentValueOfOtherCPF || 0)) + (Number(netWorth.currentValueOfMedisaveCPF || 0)) + (Number(netWorth.currentValueOfSpecialCPF || 0)) + (Number(netWorth.currentValueOfOrdinaryCPF || 0));
      const totalCashAsset = Number(cashFlow.annualSavings) + Number(cashFlow.annualInvestments);

      const totalAssets = Number(totalTangible || 0) + Number(totalInvestmentAssets || 0) + Number(totalAccount || 0) + Number(totalCashAsset || 0);
      const totalCPF = (Number(netWorth.currentValueOfOtherCPF || 0)) + (Number(netWorth.currentValueOfMedisaveCPF || 0)) + (Number(netWorth.currentValueOfSpecialCPF || 0)) + (Number(netWorth.currentValueOfOrdinaryCPF || 0));

      const debtService = Number(sumOfAllLoans || 0) / Number(totalInflow || 0);
      const debtToAsset = Number(sumOfAllLoans || 0) / totalAssets;

      const netWorthAmount = Number(totalAssets) - Number(totalLiabilities);

      const solvencyRatio = netWorthAmount / (totalAssets - totalCPF)

      console.log("Debt to asset: ", debtToAsset)
      console.log("otherCPFS: ", netWorth.currentValueOfOtherCPF || 0)
      console.log("ordinaryCPFS: ", netWorth.currentValueOfOrdinaryCPF || 0)
      console.log("specialCPFS: ", netWorth.currentValueOfSpecialCPF || 0)
      console.log("medisaveCPFS: ", netWorth.currentValueOfMedisaveCPF || 0)
      console.log("totalCPF: ", totalCPF)

      y = drawText(debtPage, `${debtService.toFixed(2)}`, x, y, 10, black, helveticaBold, 48);
      y = drawText(debtPage, `${debtToAsset}`, x, y, 10, black, helveticaBold, 53);
      y = drawText(debtPage, `${totalAssets}`, x - 5, y, 10, black, helveticaBold, 40);
      y = drawText(debtPage, `${totalLiabilities}`, x, y, 10, black, helveticaBold, 148);


      y = drawText(debtPage, `${solvencyRatio.toFixed(2)}`, x, y, 10, black, helveticaBold, 45);
      const totalInvestment = Number(netWorth.valueOfCommodities) + Number(netWorth.valueOfOtherInvestments) + Number(netWorth.valueOfCryptocurrencies) + Number(netWorth.valueOfProperties) + Number(netWorth.valueOfInsurancePolicies) + Number(netWorth.valueOfUnitTrusts) + Number(netWorth.valueOfBonds) + Number(netWorth.valueOfEquities);
      const totalNetworth = Number(netWorth.currentSavings) + Number(netWorth.currentValueOfFixedDeposits) + (Number(netWorth.currentValueOfOtherCPF || 0)) + (Number(netWorth.currentValueOfMedisaveCPF || 0)) + (Number(netWorth.currentValueOfSpecialCPF || 0)) + (Number(netWorth.currentValueOfOrdinaryCPF || 0)) + Number(netWorth.valueOfCommodities) + Number(netWorth.valueOfOtherInvestments) + Number(netWorth.valueOfCryptocurrencies) + Number(netWorth.valueOfProperties) + Number(netWorth.valueOfInsurancePolicies) + Number(netWorth.valueOfUnitTrusts) + Number(netWorth.valueOfBonds) + Number(netWorth.valueOfEquities);

      const totalInvestmentRatio = totalInvestment / totalNetworth;

      y = drawText(debtPage, `${totalInvestmentRatio}`, x, y, 10, black, helveticaBold, 77);
      const income = Number(cashFlow.annualSalary) + Number(cashFlow.annualBonus) + Number(cashFlow.annualInvestmentIncome) + Number(cashFlow.rentalIncomeAnnual) + Number(cashFlow.otherIncomeAnnual);
      const savings = Number(cashFlow.annualSavings) + Number(cashFlow.annualInvestments);
      const fixedDeposits = Number(netWorth.currentValueOfFixedDeposits);
      const liquidityRatio = (savings + fixedDeposits) / (income / 12);
      const surplus = savings + fixedDeposits - (income / 12) * 6;

      x = 40;
      if (surplus > 6) {
        y = drawText(debtPage, `Your liquidity ratio is (Recommended 6) ${liquidityRatio.toFixed(2)} \nYou are recommended to acquire ${((savings + fixedDeposits) - (income / 2)) > 0 ? 0 : ((savings + fixedDeposits) - (income / 2)).toFixed(2)} to establish your emergency savings`, x, y, 11, black, helvetica, 60);
      } else {
        y = drawText(debtPage, `Your liquidity ratio is (Recommended 6) ${liquidityRatio.toFixed(2)} \nYou are recommended to invest ${((savings + fixedDeposits) - (income / 2)) < 0 ? 0 : ((savings + fixedDeposits) - (income / 2)).toFixed(2)} since this amount exceeds the recommended ratio.`, x, y, 11, black, helvetica, 60);
      }

      const annualSavings = Number(cashFlow.annualSavings);
      const savingRatio = annualSavings / income;

      if (savingRatio < 0) {
        drawText(debtPage, `Your savings ratio is (Recommended 0.1) ${savingRatio.toFixed(2)} \nYou are recommend to save ${(annualSavings / income) > 0.1 ? 0 : (annualSavings - ((income * 0.1) * -1)).toFixed(2)} more per annum`, x, y, 11, black, helvetica, 40);
      } else {
        drawText(debtPage, `Your savings ratio is (Recommended 0.1) ${savingRatio.toFixed(2)} \nYour savings ratio is healthy \nYou can consider investing ${(annualSavings / income) < 0.1 ? 0 : (annualSavings - (income * 0.1)).toFixed(2)} per annum`, x, y, 11, black, helvetica, 40);
      }
    }

    // const drawSolvency = () => {
    //   let x = 320;
    //   let y = 591;

    //   const totalTangible = Number(netWorth.currentSavings) + Number(netWorth.currentValueOfFixedDeposits);
    //   const totalInvestmentAssets = Number(netWorth.valueOfCommodities) + Number(netWorth.valueOfOtherInvestments) + Number(netWorth.valueOfCryptocurrencies) + Number(netWorth.valueOfProperties) + Number(netWorth.valueOfInsurancePolicies) + Number(netWorth.valueOfUnitTrusts) + Number(netWorth.valueOfBonds) + Number(netWorth.valueOfEquities);
    //   const totalAccount = (Number(netWorth.currentValueOfOtherCPF|| 0 ))  + (Number(netWorth.currentValueOfMedisaveCPF|| 0 ) ) + (Number(netWorth.currentValueOfSpecialCPF|| 0 )) + (Number(netWorth.currentValueOfOrdinaryCPF|| 0 ) );
    //   const totalCashAsset = Number(cashFlow.annualSavings) + Number(cashFlow.annualInvestments);

    //   const totalAssets = Number(totalTangible) + Number(totalInvestmentAssets) + Number(totalAccount) + Number(totalCashAsset);
    //   const totalLiabilities = Number(loanData.mortgage) + Number(loanData.remainingHouseLoan) + Number(loanData.remainingVehicleLoan) + Number(loanData.remainingStudyLoan) + Number(loanData.remainingRenovationLoan) + Number(loanData.remainingCreditCardsLoan) + Number(loanData.remainingPersonalDebitLoan);

    //   const netWorthAmount = Number(totalAssets) - Number(totalLiabilities);
    //   const totalCPF = (Number(netWorth.currentValueOfOtherCPF|| 0 ))  + (Number(netWorth.currentValueOfMedisaveCPF|| 0 ) ) + (Number(netWorth.currentValueOfSpecialCPF|| 0 )) + (Number(netWorth.currentValueOfOrdinaryCPF|| 0 ) );


    //   const solvencyRatio = netWorthAmount / (totalAssets - totalCPF)

    //   y = drawText(solvencyPage, `${solvencyRatio.toFixed(2)}`, x, y, 10, black, helveticaBold, 263);

    //   // all investments 
    //   const totalInvestment = Number(netWorth.valueOfCommodities) + Number(netWorth.valueOfOtherInvestments) + Number(netWorth.valueOfCryptocurrencies) + Number(netWorth.valueOfProperties) + Number(netWorth.valueOfInsurancePolicies) + Number(netWorth.valueOfUnitTrusts) + Number(netWorth.valueOfBonds) + Number(netWorth.valueOfEquities);
    //   const totalNetworth = Number(netWorth.currentSavings) + Number(netWorth.currentValueOfFixedDeposits) + (Number(netWorth.currentValueOfOtherCPF|| 0 ))  + (Number(netWorth.currentValueOfMedisaveCPF|| 0 ) ) + (Number(netWorth.currentValueOfSpecialCPF|| 0 )) + (Number(netWorth.currentValueOfOrdinaryCPF|| 0 ) ) + Number(netWorth.valueOfCommodities) + Number(netWorth.valueOfOtherInvestments) + Number(netWorth.valueOfCryptocurrencies) + Number(netWorth.valueOfProperties) + Number(netWorth.valueOfInsurancePolicies) + Number(netWorth.valueOfUnitTrusts) + Number(netWorth.valueOfBonds) + Number(netWorth.valueOfEquities);

    //   const totalInvestmentRatio = totalInvestment / totalNetworth;

    //   y = drawText(solvencyPage, `${totalInvestmentRatio.toFixed(2)}`, x + 35, y, 10, black, helveticaBold, 0);


    // }
    const month_name = (dt) => {
      // Define an array containing names of months
      const mlist = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      // Return the name of the month corresponding to the month index of the provided date
      return mlist[dt.getMonth()];
    };


    const drawWill = (page, willData, font, boldFont, fontSize = 12) => {
      const today = new Date();
      const formattedDate = `${today.getDate()}/${today.getMonth()}/${today.getFullYear()}:${today.getHours()}:${today.getMinutes()}${today.getHours() >= 12 ? 'pm' : 'am'}`;
      const black = rgb(0, 0, 0);
      let y = 725;
      const x = 35;
      const lineHeight = fontSize + 4;

      // Function to draw text and move to the next line
      const drawText = (text, x, y, size = fontSize, isBold = false) => {
        page.drawText(text, { x, y, size, font: isBold ? boldFont : font, color: black });
        return y - lineHeight;
      };

      // Fill in dynamic data
      const clientName = personal.name + " " + personal.lastname || "Client Name";
      const clientNRIC = willData.nric || "NRIC No.";
      const clientAddress = personal.address || "Address";
      const executors = willData.executors || [];
      const guardians = willData.guardians || [];
      const beneficiaries = willData.beneficiaries || [];

      // Draw static content with dynamic data
      drawText(`${formattedDate}`, 480, y, 12, black);

      y = drawText(`LAST WILL AND TESTAMENT OF ${clientName}`, x, y, fontSize + 3, true);
      // y = drawText(``, x, y);
      y = drawText(`THIS IS THE LAST WILL AND TESTAMENT of me ${clientName}, `, x, y - 20);
      y = drawText(`${clientNRIC} of ${clientAddress} and I HEREBY REVOKE all former wills`, x, y)
      y = drawText(`and testamentary dispositions made by me and DECLARE this to be my Last Will and Testament.`, x, y)
      y = drawText(``, x, y)

      // Executors
      y = drawText(`1.EXECUTOR`, x, y)
      executors.forEach((executor, index) => {
        y = drawText(`EXECUTOR ${index + 1}: I appoint ${executor.name}  ${executor.nric}of `, x, y);
        y = drawText(`${executor.address}`, x, y);
      });
      y = drawText(``, x, y)
      // Guardians
      guardians.forEach((guardian) => {
        y = drawText(`2. I appoint ${guardian.name} ${guardian.nric}) of ${guardian.address}`, x, y);
        y = drawText(`to be the guardian of my children and I revoke all previous appointments made by me before the `, x, y);
        y = drawText(`date of this Will.`, x, y)
      });
      y = drawText(``, x, y)
      // Additional static content
      y = drawText("3. I declare that in the subsequent clauses of this my Will the expression “my Trustee” shall (where the", x, y);
      y = drawText("context permits) mean the trustee or trustees of this my Will for the time being and if there shall be", x, y);

      y = drawText(`no such trustee shall (where the context permits) include the persons empowered by statute to exercise `, x, y)
      y = drawText(`or perform the powers of my trustee (hereby or by statute conferred upon the trustees hereof) and`, x, y)
      y = drawText(`willing or bound to exercise or perform the same.`, x, y)
      y = drawText(``, x, y)
      y = drawText("4. Subject to the payment of my just debts funeral and testamentary expenses, I give, devise and ", x, y);
      y = drawText("bequeath all my real and personal property movable and immovable and of any kind or nature ", x, y);
      y = drawText(`whatsoever and wheresoever situated which I may possess to be entitled to my Trustee upon trust:`, x, y)
      // Beneficiaries
      beneficiaries.forEach((beneficiary, index) => {
        y = drawText(`4.${index + 1} to give ${beneficiary.percentOfAsset}% to ${beneficiary.name} ${beneficiary.nric}`, x, y);
      });
      y = drawText("4.3 to give the rest of my property to my children equally", x, y);
      y = drawText(``, x, y)

      // Additional static content
      y = drawText("5. My Trustees shall have the following powers:", x, y);
      y = drawText("5.1 to apply the whole or such part as my Trustees shall think fit of the expectant or presumptive share", x, y);
      y = drawText(`of any beneficiary under this Will until he or she attains the age of (21) years or for towards his or her`, x, y)
      y = drawText(`maintenance education or benefit.`, x, y)
      y = drawText("5.2 to apply the whole or such part as my Trustees shall think fit of the presumptive contingent expectant", x, y);
      y = drawText(`or vested share of the capital of any beneficiary under this Will for the advancement of benefit of such `, x, y)
      y = drawText(`beneficiary as to my Trustees shall seem fit.`, x, y)
      y = drawText("5.3 to make payments to the parent or guardian or guardians of any beneficiary under this Will without", x, y);
      y = drawText("seeing the application of such payments.", x, y);
      y = drawText(``, x, y)
    };

    const drawWitnessSection = (page, font, boldFont, fontSize = 12) => {
      const today = new Date();
      const formattedDate = `${today.getDate()}/${today.getMonth()}/${today.getFullYear()}:${today.getHours()}:${today.getMinutes()}${today.getHours() >= 12 ? 'pm' : 'am'}`;

      const black = rgb(0, 0, 0);
      let y = 725;
      const x = 35;
      const lineHeight = fontSize + 4;

      // Function to draw text and move to the next line
      const drawText = (text, x, y, size = fontSize, isBold = false) => {
        page.drawText(text, { x, y, size, font: isBold ? boldFont : font, color: black });
        return y - lineHeight;
      };

      // Static text
      // y = 640

      y = drawText(`${formattedDate}`, 480, y, 12, black);
      y = drawText("6. My Trustees shall be entitled to be indemnified out of my assets of any residuary estate against all", x, y);
      y = drawText(`liabilities incurred in the bona fide execution of their trusts and powers and in the absence of any fraud`, x, y)
      y = drawText(`or fraud or dishonesty or the wilful commission of a breach of trust my Trustees shall not be liable for`, x, y)
      y = drawText(`any loss (nor be bound to take proceedings against a co-trustee for breach of trust).`, x, y)
      const year = today.getFullYear().toString();
      const lastTwoCharacters = year.slice(-2);

      y = drawText(`IN WITNESS thereof I have here unto set my hands this ${today.getDate()} day of ${month_name(today)}, ${year}.`, x, y);


      y = drawText("SIGNED BY the abovementioned as His LAST WILL in the presence of us present at the same time", x, y - 20);
      y = drawText("who at his request in his presence and in the presence of each other have here unto subscribed", x, y);
      y = drawText("out names as witnesses.", x, y);

      drawText("WITNESS", x, y, fontSize, true);
      y = drawText("WITNESS", x + 250, y, fontSize, true);

      drawText("SIGNATURE ", x + 250, y);
      drawText("_______________________", x + 350, y)
      drawText("SIGNATURE ", x, y);
      y = drawText("_______________________", x + 80, y)

      drawText("NAME ", x + 250, y);
      drawText("_______________________", x + 350, y)
      drawText("NAME ", x, y);
      y = drawText("_______________________", x + 80, y)

      drawText("NRIC NO. ", x + 250, y);
      drawText("_______________________", x + 350, y)
      drawText("NRIC NO. ", x, y);
      y = drawText("_______________________", x + 80, y)

      drawText("ADDRESS ", x + 250, y);
      drawText("_______________________", x + 350, y)
      drawText("ADDRESS ", x, y);
      y = drawText("_______________________", x + 80, y)


      drawText("_______________________", x + 350, y)
      y = drawText("_______________________", x + 80, y)
      drawText("_______________________", x + 350, y)
      y = drawText("_______________________", x + 80, y)

    };

    const drawInsuranceCalc = () => {
      const initialCost = 40000; // $J$9
      const growthRate = 0.03; // 3% annual growth rate
      const targetAge = 25; // Assuming the target age for educational cost


      function calculateInflationAdjustedSum(totalSumNeeded, growthRate, yearsUntilIndependent, currentAge) {
        const yearsRemaining = yearsUntilIndependent - currentAge;
        const growthMultiplier = 1 + growthRate;
        const futureSum = (totalSumNeeded * Math.pow(growthMultiplier, yearsRemaining)).toFixed(2);
        return futureSum;
      }

      function calculateEducationalCost(initialCost, growthRate, targetAge, currentAge) {
        const yearsRemaining = targetAge - currentAge;
        const growthMultiplier = 1 + growthRate;
        const futureCost = (initialCost * Math.pow(growthMultiplier, yearsRemaining)).toFixed(2);
        return futureCost;
      }

      const dep = dependents.dependents.map(dependent => {
        const currentYear = new Date().getFullYear();
        const dependentDateOfBirth = new Date(dependent.dependentDateBirth);
        const currentAge = currentYear - dependentDateOfBirth.getFullYear();
        const inflationAdjustedSum = calculateInflationAdjustedSum(dependent.dependentAnnualSpending, 0.03, dependent.years, currentAge);

        let educationalCost = null;
        if (currentAge < 18) {
          educationalCost = calculateEducationalCost(initialCost, growthRate, targetAge, currentAge);
        }

        return {
          dependentName: dependent.dependentName,
          inflationAdjustedSum: inflationAdjustedSum,
          educationalCost: educationalCost
        };

      });


      const totalInflationAdjustedSum = dep.reduce((acc, curr) => Number(acc) + Number(curr.inflationAdjustedSum), 0);
      const totalEducationalCost = dep.reduce((acc, curr) => Number(acc) + Number(curr.educationalCost), 0);
      const loans = Number(loanData.remainingHouseLoan) + Number(loanData.remainingCreditCardsLoan) + Number(loanData.remainingPersonalDebitLoan) + Number(loanData.remainingRenovationLoan) + Number(loanData.remainingStudyLoan) + Number(loanData.remainingVehicleLoan);

      const totalAll = totalInflationAdjustedSum + totalEducationalCost + loans;

      const sumOfCpf = (Number(netWorth.currentValueOfOrdinaryCPF || 0)) + (Number(netWorth.currentValueOfSpecialCPF || 0)) + (Number(netWorth.currentValueOfMedisaveCPF || 0)) + (Number(netWorth.currentValueOfOtherCPF || 0));
      const death = (totalAll - sumOfCpf).toFixed(2);


      let totalExpenses = 0;

      // Sum insurance annual payments
      if (insurance.hasInsurance === "Yes") {
        const insuranceCategories = ['hospitilizationInsurance', 'personalAccident', 'earlyAndCriticalIllness', 'lifeInsurance'];
        insuranceCategories.forEach(category => {
          if (insurance[category]) {
            insurance[category].forEach(policy => {
              totalExpenses += Number(policy.annualPayment || 0);
            });
          }
        });
      }

      totalExpenses += Number(loanData.mortgagePayAnnually || 0);
      totalExpenses += Number(loanData.loansPayAnnually || 0);

      const cashFlowCategories = [
        'annualSalary', 'annualBonus', 'annualInvestmentIncome', 'rentalIncomeAnnual', 'otherIncomeAnnual',
        'annualSavings', 'annualInvestments', 'mortgagePayAnnually', 'loansPayAnnually', 'payForInsuranceAnnually',
        'payForHouseholdAnnually', 'payForTransportAnnually', 'payForDependenstAnnually', 'payForPersonalExpensesAnnually',
        'payForMedicalAnnually', 'payForMiscellaniousAnnually', 'giveForFamilyBlessingsAnnually'
      ];
      cashFlowCategories.forEach(category => {
        totalExpenses += Number(cashFlow[category] || 0);
      });

      // Sum dependents' annual spending
      if (dependents.anyDependents === "Yes") {
        dependents.dependents.forEach(dependent => {
          totalExpenses += Number(dependent.dependentAnnualSpending || 0);
        });
      }

      const eci = (Number(25000) + Number(totalExpenses)).toFixed(2);
      const ci = (75000 + (3 * Number(totalExpenses)) + 84000).toFixed(2);

      let x = 35;
      let y = 765;

      const textDeath = `Death: ${Number(death).toFixed(2)} = \n            ${(parseFloat(totalInflationAdjustedSum)).toFixed(2)} (amount needed for each dependent, inflation adjusted) + \n            ${totalEducationalCost.toFixed(2)} (average cost of education, inflation adjusted) + \n            ${loans.toFixed(2)} (loans to be paid off) - ${sumOfCpf.toFixed(2)} (all CPF accounts combined))S`
      y = drawText(insuranceCalc, textDeath, x, y, 10, black, helvetica, 48 + 50, true);
      // drawText(insuranceCalc, `Death:`, x, y, 10, black, helveticaBold, 48, true);
      // y = drawText(insuranceCalc, `${death}`, x + 37, y, 10, black, helvetica, 20, true);


      const textECI = `ECI: ${(25000 + totalExpenses).toFixed(2)} (eci) =  $25,000 + ${(parseFloat(totalExpenses)).toFixed(2)} (Total Expenses)`
      y = drawText(insuranceCalc, textECI, x, y, 10, black, helvetica, 24, true);
      // y = drawText(insuranceCalc, `${eci}`, x + 30, y, 10, black, helvetica, 20, true);

      const textCI = `CI: ${(75000 + (3 * totalExpenses) + 84000).toFixed(2)} (ci) = $75,000 + (3 * Total Expenses) + $84,000`
      drawText(insuranceCalc, textCI, x, y, 10, black, helvetica, 48, true);
      // drawText(insuranceCalc, `${ci}`, x + 27, y, 10, black, helvetica, 20, true);

    }


    const drawInvestmentsRec = () => {
      const currentYear = new Date().getFullYear();
      const dobYear = new Date(personal.dateOfBirth).getFullYear()
      const currentAge = Number(currentYear) - Number(dobYear);
      const targetYear = new Date(goals.shortTermGoals[0].targetDate).getFullYear()
      const sYearsToReach = targetYear - currentYear;

      console.log(goals)
      let results = [];

      function calculateFutureValue(rate, nper, pmt, pv = 0, type = 0) {
       // If rate is 0, the future value is simply the sum of present value and payments
        if (rate === 0) {
          return -(pv + pmt * nper);
        }

        // Adjust the payment based on the type (0 for end of period, 1 for beginning of period)
        const adjustedPmt = type === 1 ? pmt * (1 + rate) : pmt;

        // Calculate the future value using the formula similar to Excel's FV function
        const futureValue = -(pv * Math.pow(1 + rate, nper) + adjustedPmt * ((Math.pow(1 + rate, nper) - 1) / rate));

        return Number(futureValue.toFixed(2)); // Rounded to 2 decimal places for currency
      }


      const interestRate = 0.03; // 3% annual interest rate

      // Calculate surplus saving
      const cashInBank = Number(netWorth.currentSavings) || 0; // I6
      const fixedDeposit = Number(netWorth.currentValueOfFixedDeposits) || 0; // I7
      const annualIncome = Number(cashFlow.annualSalary) || 0; // I2

      // const cashInBank = 30000; // I6
      // const fixedDeposit = 12000; // I7
      // const annualIncome = 60000; // I2
  

      const shortTermRate = 0.02
      const midTermRate = 0.04
      const longTermRate = 0.07

      const surplusSaving = (cashInBank + fixedDeposit) - (annualIncome / 2);

      // Calculate surplus inflow

      const totalInflow =
        Number(cashFlow.annualSalary) +
        Number(cashFlow.annualBonus) +
        Number(cashFlow.annualInvestmentIncome) +
        Number(cashFlow.rentalIncomeAnnual) +
        Number(cashFlow.otherIncomeAnnual);

      const totalSIOutflow = Number(cashFlow.annualSavings) + Number(cashFlow.annualInvestments);

      const totalOutflow =
        Number(cashFlow.payForHouseholdAnnually) +
        Number(cashFlow.payForTransportAnnually) +
        Number(cashFlow.payForDependenstAnnually) +
        Number(cashFlow.payForPersonalExpensesAnnually) +
        Number(cashFlow.payForMedicalAnnually) +
        Number(cashFlow.payForMiscellaniousAnnually) +
        Number(cashFlow.giveForFamilyBlessingsAnnually);

      const CRSLoan = Number(loanData.remainingVehicleLoan) + Number(loanData.remainingRenovationLoan) + Number(loanData.remainingStudyLoan);

      const totalFixedOutflow = Number(cashFlow.mortgagePayAnnually) + Number(CRSLoan) + Number(cashFlow.payForInsuranceAnnually) + Number(loanData.incomeTaxLastYear);

      const surplusInflow = totalInflow - (totalSIOutflow + totalOutflow + totalFixedOutflow);

      let y = 755
      let x = 35


      const shortTermGoalsTotal = calculateFutureValue(0.02, sYearsToReach, -Number(surplusInflow), -Number(surplusSaving))
      const shortTermGoalsInflationAdjusted = calculateFutureValue(0.03, sYearsToReach, 0, -(Number(goals.shortTermGoals[0].amount)))

      y = drawText(investmentsRec, `Short Term Goals`, x, y, 18, black, helveticaBold, 25);

      const text1 = `You have enough emergency savings With a surplus saving of ${surplusSaving > 0 ? parseFloat(surplusSaving.toFixed(2)).toLocaleString() : 0} after deducting \nemergency savings, and surplus inflow of ${parseFloat(surplusInflow.toFixed(2)).toLocaleString()} per annum, You can get ${parseFloat(shortTermGoalsTotal.toFixed(2)).toLocaleString()} \nat a rate of ${2}% per annum.`;
      const stext2 = `You can successfully achieve your goals at $${((shortTermGoalsTotal - shortTermGoalsInflationAdjusted) > 0 ? parseFloat((shortTermGoalsTotal - shortTermGoalsInflationAdjusted)).toLocaleString() : 0)} in surplus`
      const stext3 = `You are short of $${((shortTermGoalsTotal - shortTermGoalsInflationAdjusted) < 0 ? parseFloat((shortTermGoalsTotal - shortTermGoalsInflationAdjusted)).toLocaleString() : 0)} away from your goal.`
      y = drawText(investmentsRec, text1, x, y, 12, black, helvetica, 68);
      y = (shortTermGoalsTotal - shortTermGoalsInflationAdjusted) < 0 ? drawText(investmentsRec, stext3, x, y, 12, black, helvetica, 14) : drawText(investmentsRec, stext2, x, y, 12, black, helvetica, 14)

      const midTermGoals = results.filter(result => result.goalType === 'midTermGoals')[0];
      y = drawText(investmentsRec, `Mid Term Goals`, x, y, 18, black, helveticaBold, 25);

      const text2 = `You have enough emergency savings With a surplus saving of ${surplusSaving > 0 ? parseFloat(surplusSaving.toFixed(2)).toLocaleString() : 0} after deducting \nemergency savings, and surplus inflow of ${parseFloat(surplusInflow.toFixed(2)).toLocaleString()} per annum, You can get ${parseFloat(midTermGoals.total.toFixed(2)).toLocaleString()} \nat a rate of ${midTermRate} per annum. You can successfully achieve your goals at $${((midTermGoals.total - midTermGoals.inflationAdjusted) > 0 ? parseFloat((midTermGoals.total - midTermGoals.inflationAdjusted)).toLocaleString() : 0)} in surplus \nOr\nYou are short of $${((midTermGoals.total - midTermGoals.inflationAdjusted) > 0 ? parseFloat((midTermGoals.total - midTermGoals.inflationAdjusted)).toLocaleString() : 0)} away from your goal.`;
      y = drawText(investmentsRec, text2, x, y, 12, black, helvetica, 140);

      const longTermGoals = results.filter(result => result.goalType === 'longTermGoals')[0];

      y = drawText(investmentsRec, `Long Term Goals`, x, y, 18, black, helveticaBold, 25);
      const text3 = `You have enough emergency savings With a surplus saving of ${surplusSaving > 0 ? parseFloat(surplusSaving.toFixed(2)).toLocaleString() : 0} after deducting \nemergency savings, and surplus inflow of ${parseFloat(surplusInflow.toFixed(2)).toLocaleString()} per annum, You can get ${parseFloat(longTermGoals.total.toFixed(2)).toLocaleString()} \nat a rate of ${longTermRate} per annum. You can successfully achieve your goals at $${((longTermGoals.total - longTermGoals.inflationAdjusted) > 0 ? parseFloat((longTermGoals.total - longTermGoals.inflationAdjusted)).toLocaleString() : 0)} in surplus \nOr\nYou are short of $${((longTermGoals.total - longTermGoals.inflationAdjusted) > 0 ? parseFloat((longTermGoals.total - longTermGoals.inflationAdjusted)).toLocaleString() : 0)} away from your goal.`;
      y = drawText(investmentsRec, text3, x, y, 12, black, helvetica, 25);



    }



    drawPersonalInfo();
    drawGoals(shortTermPage, goals.shortTermGoals, 63, 615);
    drawGoals(midTermPage, goals.midTermGoals, 63, 613);
    drawGoals(longTermPage, goals.longTermGoals, 63, 615);
    drawNetWorth();
    drawCashFlow();
    drawCPFAnalysis();
    drawAssetAllocationPage();
    drawInsuranceSummary();
    drawDebt();
    // drawSolvency();
    drawWill(willPage1, will, helvetica, helveticaBold, 12);
    drawWitnessSection(willPage2, helvetica, helveticaBold, 12)
    drawInsuranceCalc();
    drawInvestmentsRec();

    const pdfBytes = await pdfDoc.save();

    // Create a Blob from the PDF bytes
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    let url = URL.createObjectURL(blob);
    url += '#page=31';

    // Open the generated PDF in a new browser tab
    window.open(url, "_blank");
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
}
