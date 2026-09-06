const XLSX = require("xlsx");
const path = require("path");

const filePath = path.join(
  __dirname,
  "../public/Resume_utility.xlsx_enhancement_request-Genspark_AI_Sheets-20260906_1813.xlsx"
);

const workbook = XLSX.readFile(filePath, { cellFormula: true, cellStyles: true });

console.log("=== WORKBOOK SHEET NAMES ===");
console.log(workbook.SheetNames);

workbook.SheetNames.forEach((sheetName) => {
  console.log(`\n======================================================`);
  console.log(`SHEET: ${sheetName}`);
  console.log(`======================================================`);
  const worksheet = workbook.Sheets[sheetName];
  
  // JSON view
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });
  console.log("Row count:", jsonData.length);
  
  jsonData.forEach((row, rowIndex) => {
    if (row && row.some((cell) => cell !== undefined && cell !== "")) {
      console.log(`Row ${rowIndex + 1}:`, JSON.stringify(row));
    }
  });

  // Extract any formulas in this sheet
  console.log("\nFormulas found in sheet:");
  let formulaCount = 0;
  for (const cellAddress in worksheet) {
    if (cellAddress[0] === "!") continue;
    const cell = worksheet[cellAddress];
    if (cell && cell.f) {
      console.log(`  Cell ${cellAddress}: =${cell.f}  (Value: ${cell.v})`);
      formulaCount++;
    }
  }
  if (formulaCount === 0) {
    console.log("  (No formulas in this sheet)");
  }
});
