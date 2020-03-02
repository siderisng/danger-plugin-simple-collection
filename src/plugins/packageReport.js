/* global danger */
import { checkForNewDependencies, checkForRelease, checkForTypesInDeps } from 'danger-plugin-yarn';

export default async function getCustomReporting() {
  const packageDiff = await danger.git.JSONDiffForFile('package.json');
  await checkForNewDependencies(packageDiff);
  checkForRelease(packageDiff);
  checkForTypesInDeps(packageDiff);
}
