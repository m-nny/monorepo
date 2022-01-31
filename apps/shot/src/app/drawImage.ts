import _ from 'lodash';
import { ShootResponse } from './shootImage';

export type DrawImageArgs = {
  jpgPath: string;
  response: ShootResponse;
};

const CONFIDENCE_THRESHOLD = 0.6;

export const DrawImageBox = async ({ jpgPath, response }: DrawImageArgs) => {
  const boxes = _(response.foundItems)
    .filter((item) => item.className === 'phone')
    .filter((item) => item.confidence > CONFIDENCE_THRESHOLD)
    .value();
};
