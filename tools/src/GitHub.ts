import { Octokit, RestEndpointMethodTypes } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// Predefine some params used across almost all requests.
const owner = 'expo';
const repo = 'expo';

/**
 * Returns public informations about the currently authenticated (by GitHub API token) user.
 */
export async function getAuthenticatedUserAsync() {
  const { data } = await octokit.users.getAuthenticated();
  return data;
}

/**
 * Requests for the pull request object.
 */
export async function getPullRequestAsync(pull_number: number): Promise<PullRequest> {
  const { data } = await octokit.pulls.get({
    owner,
    repo,
    pull_number,
  });
  return data;
}

/**
 * Gets a list of reviews left in the pull request with given ID.
 */
export async function listPullRequestReviewsAsync(
  pull_number: number
): Promise<PullRequestReview[]> {
  const { data } = await octokit.pulls.listReviews({
    owner,
    repo,
    pull_number,
  });
  return data;
}

/**
 * Creates pull request review. By default the review is pending which needs to be submitted in order to be visible for other users.
 * Provide `event` option to create and submit at once.
 */
export async function createPullRequestReviewAsync<T>(
  pull_number: number,
  options?: T
): Promise<PullRequestReview> {
  const { data } = await octokit.pulls.createReview({
    owner,
    repo,
    pull_number,
    ...options,
  });
  return data;
}

/**
 * Updates pull request review with a new main comment.
 */
export async function updatePullRequestReviewAsync(
  pull_number: number,
  review_id: number,
  body: string
) {
  const { data } = await octokit.pulls.updateReview({
    owner,
    repo,
    pull_number,
    review_id,
    body,
  });
  return data;
}

/**
 * Gets a list of comments in review.
 */
export async function listPullRequestReviewCommentsAsync(pull_number: number, review_id: number) {
  const { data } = await octokit.pulls.listReviewComments({
    owner,
    repo,
    pull_number,
    review_id,
  });
  return data;
}

/**
 * Deletes a comment left under pull request review.
 */
export async function deletePullRequestReviewCommentAsync(comment_id: number) {
  const { data } = await octokit.pulls.deleteReviewComment({
    owner,
    repo,
    comment_id,
  });
  return data;
}

/**
 * Deletes all comments from given review.
 */
export async function deleteAllPullRequestReviewCommentsAsync(
  pull_number: number,
  review_id: number
) {
  const comments = await listPullRequestReviewCommentsAsync(pull_number, review_id);

  await Promise.all(
    comments
      .filter((comment) => comment.pull_request_review_id === review_id)
      .map((comment) => deletePullRequestReviewCommentAsync(comment.id))
  );
}

/**
 * Requests given users to review the pull request.
 * If the user already reviewed the PR, it resets his review state.
 */
export async function requestPullRequestReviewersAsync(pull_number: number, reviewers: string[]) {
  const { data } = await octokit.pulls.requestReviewers({
    owner,
    repo,
    pull_number,
    reviewers,
  });
  return data;
}

/**
 * Adds labels to the issue. Throws an error when any of given labels doesn't exist.
 */
export async function addIssueLabelsAsync(issue_number: number, labels: string[]) {
  const { data } = await octokit.issues.addLabels({
    owner,
    repo,
    issue_number,
    labels,
  });
  return data;
}

/**
 * Removes single label from the issue.
 * Throws an error when given label doesn't exist and when the label isn't added.
 */
export async function removeIssueLabelAsync(issue_number: number, name: string) {
  const { data } = await octokit.issues.removeLabel({
    owner,
    repo,
    issue_number,
    name,
  });
  return data;
}

// Octokit's types are autogenerated and so inconvenient to use if you want to refer to them.
// We re-export some of them to make it easier.
export type PullRequestReviewEvent = 'COMMENT' | 'APPROVE' | 'REQUEST_CHANGES';
export type PullRequest = RestEndpointMethodTypes['pulls']['get']['response']['data'];
export type PullRequestReview = RestEndpointMethodTypes['pulls']['getReview']['response']['data'];
