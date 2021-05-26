import minimatch from 'minimatch';
import path from 'path';
import prettyBytes from 'pretty-bytes';

import Git from '../../Git';
import { ReviewInput, ReviewOutput, ReviewStatus } from '../types';

const FILE_SIZE_LIMIT = 5 * 1000 * 1000; // 5MB
const PRETTY_FILE_SIZE_LIMIT = prettyBytes(FILE_SIZE_LIMIT);

const IGNORED_PATHS = ['android/versioned-abis/**/*.aar'];

export default async function ({ pullRequest, diff }: ReviewInput): Promise<ReviewOutput | null> {
  const listTree = await Git.listTreeAsync(
    pullRequest.head.sha,
    diff.filter((file) => !file.deleted).map((file) => file.path)
  );

  const fileReports = listTree
    .map((file) => {
      const logs: string[] = [];

      // We may ignore some paths where the files are allowed to be bigger (e.g. versioned .aar files).
      if (IGNORED_PATHS.some((pattern) => minimatch(file.path, pattern))) {
        return null;
      }
      if (path.extname(file.path).substr(1) === 'gif') {
        logs.push(`**GIF** format is forbidden, please consider using **MP4** format`);
      }
      if (file.size > FILE_SIZE_LIMIT) {
        const prettySize = prettyBytes(file.size);
        logs.push(`File size **${prettySize}** exceeds the limit of **${PRETTY_FILE_SIZE_LIMIT}**`);
      }
      if (logs.length === 0) {
        return null;
      }
      return `- ${linkToFile(pullRequest, file.path)}\n  - ${logs.join('\n  - ')}`;
    })
    .filter(Boolean);

  if (fileReports.length === 0) {
    return null;
  }

  return {
    status: ReviewStatus.ERROR,
    title: 'Forbidden file size or format',
    body: fileReports.join('\n'),
  };
}

function linkToFile(pr: ReviewInput['pullRequest'], path: string): string {
  return `[${path}](${pr.head.repo.html_url}/blob/${pr.head.ref}/${encodeURIComponent(path)})`;
}
