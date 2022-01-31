import 'dotenv/config';
import ProgressBar from 'progress';
import { logger } from './app/logger';
import { runImage } from './app/runImage';
import { getFrameJson } from './app/utils';

async function runMain() {
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

runMain();
