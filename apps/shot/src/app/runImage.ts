import fs from 'fs-extra';
import path from 'path';
import { drawImageBox } from './drawImage';
import { shootImage } from './shootImage';
import { getFrameJpgPath, getOuputJpgPath, ImageInfo } from './utils';

type RunImageArgs = { image: ImageInfo };

export async function runImage({
  image: { publicUrl, batchId },
}: RunImageArgs) {
  const filename = path.basename(publicUrl);
  const jpgPath = getFrameJpgPath({ batchId, filename });
  const fileExists = await fs.pathExists(jpgPath);
  if (!fileExists) {
    throw new Error(`File ${jpgPath} does not exit`);
  }
  const response = await shootImage(jpgPath);
  const outputPath = getOuputJpgPath({ batchId, filename });
  await fs.ensureDir(path.dirname(outputPath));
  await drawImageBox({ jpgPath, response, outputPath });
  return response;
}
