import path from 'path';
import { findIssueDocuments } from './findIssueDocuments';
import { getIssues } from './getIssues';
import { download } from './utils';

export async function runApp() {
  const issues = await getIssues();
  if (issues === null) {
    console.log('Aborting download');
    return null;
  }
  const filesToDownload = await findIssueDocuments(issues.slice(0, 3));
  console.table(filesToDownload.map((item) => ({ name: item.issue.name, url: item.document.url })));

  for (const item of filesToDownload) {
    const destination = path.join('./tmp', item.document.title);
    await download(item.issue.url, destination);
  }
}
