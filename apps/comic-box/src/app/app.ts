import { findIssueDocuments } from './findIssueDocuments';
import { getIssues } from './getIssues';

export async function runApp() {
  const issues = await getIssues();
  if (issues === null) {
    console.log('Aborting download');
    return null;
  }
  const filesToDownload = await findIssueDocuments(issues.slice(0, 3));
  console.table(filesToDownload);
}
