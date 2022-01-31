import fs from 'fs-extra';
import path from 'path';
import { logger } from './logger';

export const BASE_DIR = './data-mounts/2021.10.11.predictions.cheated';

export type GetFrameJpgPathArgs = {
  batchId: string;
  filename: string;
};

export const GetFrameJpgPath = ({ batchId, filename }: GetFrameJpgPathArgs) =>
  path.join(BASE_DIR, 'frames', batchId, filename);

export type ImageInfo = {
  batchId: string;
  id: string;
  publicUrl: string;
  resolution: string;
};
export const getFrameJson = (): Promise<ImageInfo[]> => {
  const jsonPath = path.join(BASE_DIR, 'frames.json');
  logger.info(`Loading frames json`, { jsonPath });
  return fs.readJson(jsonPath);
};
