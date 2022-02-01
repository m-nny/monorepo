import gm from 'gm';
import _ from 'lodash';
import { CONFIDENCE_THRESHOLD } from './constants';
import { logger } from './logger';
import { BoxType, ShootResponse } from './types';

export type DrawImageArgs = {
  jpgPath: string;
  outputPath: string;
  response: ShootResponse;
};

export const drawRectangle = (
  jpgPath: string,
  outputPath: string,
  rectangles: BoxType[]
) =>
  new Promise<void>((res, rej) => {
    const image = gm(jpgPath);
    rectangles.forEach(({ top, left, bottom, right }) =>
      image
        .stroke('#FF0000', 2)
        .fill('none')
        .drawRectangle(left, top, right, bottom)
    );

    image.write(outputPath, (err) => {
      if (err) rej(err);
      res();
    });
  });

export const drawImageBox = async ({
  jpgPath,
  response,
  outputPath,
}: DrawImageArgs) => {
  const boxes = _(response.foundItems)
    .filter((item) => item.className === 'phone')
    .filter((item) => item.confidence > CONFIDENCE_THRESHOLD)
    .value();
  if (boxes.length === 0) {
    logger.warn(
      { jpgPath, response: response.foundClassScores },
      'No phones found'
    );
  }
  await drawRectangle(jpgPath, outputPath, _(boxes).map('box').value());
  logger.debug(
    { outputPath, boxes: boxes.length },
    `Image is written to ${outputPath}`
  );
};
