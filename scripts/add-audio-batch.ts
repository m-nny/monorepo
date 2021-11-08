import 'zx/globals';
import { addAudioBatch } from './utils';

(async function () {
  //const inputVideoGlob = argv['input-video'];
  //const inputAudioGlob = argv['input-audio'];
  //const inputSubtitleGlob = argv['input-subtitle'];
  //const outputVideoDir = argv['output-video'];

  //if (
  //!inputVideoGlob ||
  //!inputAudioGlob ||
  //!outputVideoDir ||
  //!inputSubtitleGlob
  //) {
  //console.log(
  //`All ${chalk.yellow(
  //'--input-video --input-audio --input-subtitle --output-video'
  //)} are required`
  //);
  //process.exit(1);
  //}
  const args = {
    inputVideoGlob: './data-mounts/dr_stone_s02/Dr. Stone S02E*.mkv',
    inputAudioGlob:
      './data-mounts/dr_stone_s02/Ru Sounds/Crunchyroll/[S3rNx] Dr. Stone Stone Wars *.mka',
    inputSubtitleGlob:
      './data-mounts/dr_stone_s02/Ru Subs/Crunchyroll/[S3rNx] Dr. Stone Stone Wars *.ass',
    outputVideoDir: './data-mounts/tmp/mixed',
  };

  await addAudioBatch(args);
})();
