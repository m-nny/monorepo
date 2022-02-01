import ProgressBar from 'progress';
import { logger } from './logger';
import { runImage } from './runImage';
import { getFrameJson } from './utils';

export async function runShot() {
  let framesJson = await getFrameJson();

  const limit = 0;
  framesJson = framesJson.slice(-limit);

  const bar = new ProgressBar('  shooting [:bar] :rate/bps :percent :etas', {
    total: framesJson.length,
    complete: '=',
    incomplete: ' ',
    width: 80,
  });
  for (const image of framesJson) {
    await runImage({ image });
    bar.tick();
  }
  bar.terminate();
  logger.info(`${framesJson.length} images shot`);
}
