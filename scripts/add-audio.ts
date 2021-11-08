import 'zx/globals';
import { addAudio } from './utils';

(async function () {
  const inputVideo = argv['input-video'];
  const inputAudio = argv['input-audio'];
  const inputSubtitle = argv['input-subtitle'];
  const outputVideo = argv['output-video'];

  if (!inputVideo || !inputAudio || !outputVideo || !inputSubtitle) {
    console.log(
      `All ${chalk.yellow(
        '--input-video --input-audio --output-video --input-subtitle'
      )} are required`
    );
    process.exit(1);
  }

  await addAudio({ inputVideo, inputAudio, outputVideo, inputSubtitle });
})();

