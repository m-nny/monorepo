import fs from 'fs-extra';
import path from 'path';
import { BASE_DIR } from './constants';
import { logger } from './logger';

export type GetFrameJpgPathArgs = {
  batchId: string;
  filename: string;
};

export const getFrameJpgPath = ({ batchId, filename }: GetFrameJpgPathArgs) =>
  path.join(BASE_DIR, 'frames', batchId, filename);

export const getOuputJpgPath = ({ batchId, filename }: GetFrameJpgPathArgs) =>
  path.join(BASE_DIR, 'frames_rect', batchId, filename);

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
