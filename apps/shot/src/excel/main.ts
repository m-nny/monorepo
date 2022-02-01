import { Workbook } from 'exceljs';

export async function runExcel() {
  const inputFile = `data-mounts/excel/part.1.xlsx`;
  const workbook = new Workbook();
  await workbook.xlsx.readFile(inputFile);
  console.log({ workbook });
}
