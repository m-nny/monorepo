import { CellHyperlinkValue, Workbook } from 'exceljs';
import _ from 'lodash';
import path from 'path';
import { logger } from '../shot/logger';
import { getFrameJpgPath, getFrameJson } from '../shot/utils';

const isCellHyperlinkValue = (obj: any): obj is CellHyperlinkValue =>
  _.isString(obj?.text) && _.isString(obj?.hyperlink);

function getSuffix(url: string): string {
  const rgx = /\/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}\/\d+\.jpg/g;
  const match = rgx.exec(url);
  return match[0];
}

export async function runExcel() {
  const inputFile = `data-mounts/excel/part.1.xlsx`;
  const outputFile = `/mnt/NAS-pi/vault/aero/docs/part.1.remaster.xlsx`;
  const workbook = new Workbook();
  await workbook.xlsx.readFile(inputFile);

  const reportWs = workbook.getWorksheet('reports');
  const datarawWs = workbook.getWorksheet('data raw');

  const imageExampleColumn = datarawWs.getColumn('F');
  const rawImageColumn = datarawWs.getColumn('M');
  const framedImageColumn = datarawWs.getColumn('N');

  const framesJson = await getFrameJson();

  imageExampleColumn.eachCell((cell, rowNumber) => {
    if (rowNumber % 10 !== 3) {
      return;
    }
    const value = cell.value;
    if (!isCellHyperlinkValue(value)) {
      logger.warn({ value }, `Cell is not hyperlink`);
      return;
    }
    const url = value.text;
    const suffix = getSuffix(url);
    const frame = framesJson.find((item) => item.publicUrl.endsWith(suffix));
    if (!frame) {
      logger.warn({ url, rowNumber, suffix }, `Could not find frame`);
      return;
    }
    const filename = path.basename(url);
    const jpgPath = getFrameJpgPath({ batchId: frame.batchId, filename });
    const imageId = workbook.addImage({ filename: jpgPath, extension: 'jpeg' });
    datarawWs.addImage(imageId, {
      tl: { col: rawImageColumn.number, row: rowNumber - 1 },
      ext: { width: 500, height: 500 },
    });
    logger.debug({ url, rowNumber, suffix, frame, jpgPath }, 'Hi');
  });
  workbook.xlsx.writeFile(outputFile);
  logger.info({ outputFile }, `File is written to ${outputFile}`);
}
