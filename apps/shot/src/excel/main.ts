import { CellHyperlinkValue, Workbook } from 'exceljs';
import _ from 'lodash';
import path from 'path';
import { logger } from '../shot/logger';
import {
  getFrameJpgPath,
  getFrameJson,
  getRectFrameJpgPath,
} from '../shot/utils';

const isCellHyperlinkValue = (obj: any): obj is CellHyperlinkValue =>
  _.isString(obj?.text) && _.isString(obj?.hyperlink);

function getSuffix(url: string): string {
  const rgx = /\/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}\/\d+\.jpg/g;
  const match = rgx.exec(url);
  return match[0];
}

export async function runExcel() {
  const filename = `2021.08.25 post factum reports. part 5`;
  const inputFile = `/mnt/NAS-pi/vault/aero/docs/${filename}.xlsx`;
  const outputFile = `/mnt/NAS-pi/vault/aero/docs/${filename}.remaster.xlsx`;
  const workbook = new Workbook();
  await workbook.xlsx.readFile(inputFile);

  const reportWs = workbook.getWorksheet('reports');
  const datarawWs = workbook.getWorksheet('data raw');

  const imageExampleColumn = datarawWs.getColumn('F');
  const rawImageColumn = reportWs.getColumn('G');
  const framedImageColumn = reportWs.getColumn('H');

  const framesJson = await getFrameJson();

  imageExampleColumn.eachCell((cell, rowNumber) => {
    // if (rowNumber % 10 !== 3) {
    //   return;
    // }
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
    const rawJpgPath = getFrameJpgPath({ batchId: frame.batchId, filename });
    const framedJpgPath = getRectFrameJpgPath({
      batchId: frame.batchId,
      filename,
    });

    const rawJpgImageId = workbook.addImage({
      filename: rawJpgPath,
      extension: 'jpeg',
    });
    reportWs.addImage(rawJpgImageId, {
      tl: { col: rawImageColumn.number - 1, row: rowNumber - 1 },
      ext: { width: 500, height: 500 },
    });

    const framedJpgImageId = workbook.addImage({
      filename: framedJpgPath,
      extension: 'jpeg',
    });
    reportWs.addImage(framedJpgImageId, {
      tl: { col: framedImageColumn.number - 1, row: rowNumber - 1 },
      ext: { width: 500, height: 500 },
    });

    logger.debug(
      { url, rowNumber, suffix, frame, rawJpgPath, framedJpgPath },
      'Hi'
    );
  });

  workbook.xlsx.writeFile(outputFile);
  logger.info({ outputFile }, `File is written to ${outputFile}`);
}
