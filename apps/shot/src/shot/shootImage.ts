import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs-extra';
import { TOFU_API } from './constants';
import { ShootResponse } from './types';

export const shootImage = async (jpgPath: string): Promise<ShootResponse> => {
  const formData = new FormData();
  formData.append('image', fs.createReadStream(jpgPath));
  const res = await axios.post<ShootResponse>(TOFU_API, formData, {
    headers: formData.getHeaders(),
  });
  return res.data;
};
