/**
 * @file GitLab API service.
 * @module services/gitlabService
 * @author Felix Berglund
 * @description Handles API calls to GitLab for fetching, updating, and closing issues.
 */

/**
 * Fetches issues from the GitLab API for the specified project.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of issues.
 */
export async function getIssues () {
  const response = await fetch(
    `https://gitlab.lnu.se/api/v4/projects/${process.env.PROJECT_ID}/issues?state=opened`,
    { headers: { 'PRIVATE-TOKEN': process.env.GITLAB_TOKEN } }
  )
  return response.json()
}

/**
 * Closes an issue in the GitLab API.
 *
 * Links:
 * - https://docs.gitlab.com/ee/api/issues.html#edit-issue
 * - https://docs.gitlab.com/ee/api/issues.html#update-an-issue
 * - https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
 * - https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch
 * 
 * @param {number} issueId - The ID of the issue to close.
 * @returns {Promise<object>} A promise that resolves to the updated issue.
 */
export async function closeIssue (issueId) {
  const response = await fetch(
    `https://gitlab.lnu.se/api/v4/projects/${process.env.PROJECT_ID}/issues/${issueId}`,
    {
      method: 'PUT',
      headers: {
        'PRIVATE-TOKEN': process.env.GITLAB_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ state_event: 'close' }),
    }
  )
  return response.json()
}