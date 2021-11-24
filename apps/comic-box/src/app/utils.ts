import axios from 'axios';
import fs from 'fs-extra';

export async function download(url: string, destination: string) {
  const { data } = await axios.get<Buffer>(url, { responseType: 'arraybuffer' });
  await fs.writeFile(destination, data);
}
