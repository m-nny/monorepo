import { runImage } from './app/runImage';
import { getFrameJson } from './app/utils';

async function runMain() {
  const framesJson = await getFrameJson();

  for (const image of framesJson) {
    await runImage({ image });
    break;
  }
}

runMain();
