import { Comic } from '@m-nny/comicgeeks';
import axios from 'axios';
import _ from 'lodash';
import { authorizeVk } from './authorizeVk';

export type SearchDocumentsResultItem = {
  id: number;
  owner_id: number;
  title: string;
  size: number;
  ext: string;
  date: number;
  type: number;
  url: number;
};
export type SearchDocumentsResult = {
  response: {
    count: number;
    items: SearchDocumentsResultItem[];
  };
};

async function searchDocuments(access_token: string, q: string, count = 3): Promise<SearchDocumentsResultItem[]> {
  const { data } = await axios.request<SearchDocumentsResult>({
    url: 'https://api.vk.com/method/docs.search',
    params: {
      v: '5.131',
      access_token,
      q,
      count,
    },
  });
  return data.response.items;
}

export async function findIssueDocument(access_token: string, issue: Comic): Promise<SearchDocumentsResultItem | null> {
  const simpleIssueName = issue.name.replace(/[^\w\s]/gi, ' ');
  const documents = await searchDocuments(access_token, simpleIssueName);

  const bestFit = _(documents)
    .filter((item) => item.ext === 'cbr')
    .maxBy((item) => item.date);
  return bestFit;
}
export async function findIssueDocuments(issues: Comic[]) {
  const access_token = await authorizeVk();
  const results = await Promise.all(
    issues.map(async (issue) => ({ issue, document: await findIssueDocument(access_token, issue) }))
  );
  return results;
}
