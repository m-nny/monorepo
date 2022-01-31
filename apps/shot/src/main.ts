import { runImage } from './app/runImage';
import { getFrameJson } from './app/utils';

async function runMain() {
  const framesJson = await getFrameJson();

  let limit = 10;

  for (const image of framesJson) {
    await runImage({ image });
    if (limit-- === 0) {
      break;
    }
  }
}

runMain();
