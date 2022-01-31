import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs-extra';
import { ShootResponse } from './types';

export const shootImage = async (jpgPath: string): Promise<ShootResponse> => {
  const formData = new FormData();
  formData.append('image', fs.createReadStream(jpgPath));
  const res = await axios.post<ShootResponse>(
    `http://localhost:3005/tofu/crop_and_phones/image`,
    formData,
    { headers: formData.getHeaders() }
  );
  return res.data;
};
