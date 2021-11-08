import _ from 'lodash';
import 'zx/globals';

export type AddAudioArgs = {
  inputVideo: string;
  inputAudio: string;
  inputSubtitle: string;
  outputVideo: string;
};

export async function addAudio(args: AddAudioArgs) {
  console.log(`Processing: `);
  console.log(chalk.green(JSON.stringify(args, null, 4)));
  const status = await $`
    ffmpeg \
      -hide_banner \
      -i ${args.inputVideo} \
      -i ${args.inputAudio} \
      -i ${args.inputSubtitle} \
      -map 0 -map 1:a -map 2:s \
      -c copy -shortest \
      -metadata:s:s:0 language=rus \
      ${args.outputVideo}
  `;
  console.log({ status: status.exitCode });
}

export type AddAudioBatchArgs = {
  inputVideoGlob: string;
  inputAudioGlob: string;
  inputSubtitleGlob: string;
  outputVideoDir: string;
};

export async function addAudioBatch(args: AddAudioBatchArgs) {
  const inputVideos = await glob(args.inputVideoGlob);
  const inputAudios = await glob(args.inputAudioGlob);
  const inputSubtitles = await glob(args.inputSubtitleGlob);
  if (
    inputVideos.length !== inputAudios.length ||
    inputVideos.length !== inputSubtitles.length
  ) {
    console.log(`Globs returned different length`);
    console.dir(
      chalk.yellow(
        _.mapValues(
          { inputVideos, inputAudios, inputSubtitles },
          (item) => item.length
        )
      )
    );
    process.exit(1);
  }

  inputVideos.sort();
  inputAudios.sort();
  inputSubtitles.sort();

  const zip = _.range(inputVideos.length).map(
    (idx) =>
      [
        inputVideos[idx],
        inputAudios[idx],
        inputSubtitles[idx],
        path.join(args.outputVideoDir, path.basename(inputVideos[idx])),
      ] as const
  );
  console.table(zip.map((row) => row.map((item) => path.basename(item))));

  const isOk = await question('Is this mapping correct (y/N)?');
  if (isOk.toLowerCase() !== 'y' && isOk.toLowerCase() !== 'yes') {
    console.log(`Aborting. Try another globs`);
    process.exit(1);
  }

  await fs.ensureDir(args.outputVideoDir);

  for (const [inputVideo, inputAudio, inputSubtitle, outputVideo] of zip) {
    await addAudio({
      inputVideo,
      inputAudio,
      inputSubtitle,
      outputVideo,
    });
  }
}
