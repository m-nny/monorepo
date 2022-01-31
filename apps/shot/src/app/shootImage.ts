import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs-extra';

export const shootImage = (jpgPath: string): Promise<ShootResponse> => {
  const formData = new FormData();
  formData.append('image', fs.createReadStream(jpgPath));
  return axios
    .post<ShootResponse>(`http://localhost:3005/tofu/phones/image`, formData, {
      headers: formData.getHeaders(),
    })
    .then((res) => res.data);
};

type BoxType = { left: number; top: number; right: number; bottom: number };

type FountItemType = {
  confidence: number;
  className: string;
  box: BoxType;
};

export type ShootResponse = {
  foundItems: FountItemType[];
  foundItemsCount: number;
  unfilteredItemsCount: number;
  foundClasses: string[];
  foundClassScores: Record<string, number>;
};
