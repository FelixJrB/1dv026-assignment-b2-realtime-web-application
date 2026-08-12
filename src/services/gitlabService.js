/**
 * @file GitLab API service.
 * @module services/gitlabService
 * @author Felix Berglund
 * @description Handles API calls to GitLab for fetching, updating, and closing issues.
 */

/**
 * Fetches issues from the GitLab API based on the specified state (opened or closed).
 * 
 * @param {string} state - The state of issues to fetch (e.g., 'opened' or 'closed').
 * @returns {Promise<Array>} A promise that resolves to an array of issues.
 */
export async function getIssues (state = 'opened') {
  const response = await fetch(
    `https://gitlab.lnu.se/api/v4/projects/${process.env.PROJECT_ID}/issues?state=${state}`,
    { headers: { 'PRIVATE-TOKEN': process.env.GITLAB_TOKEN } }
  )
  return response.json()
}

/**
 * Updates the state of an issue in the GitLab API.
 *
 * Links:
 * - https://docs.gitlab.com/ee/api/issues.html#edit-issue
 * - https://docs.gitlab.com/ee/api/issues.html#update-an-issue
 * - https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
 * - https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch
 * 
 * @param {number} issueId - The ID of the issue to update.
 * @param {string} stateEvent - The state event to set for the issue (e.g., 'close' or 'reopen').
 * @returns {Promise<object>} A promise that resolves to the updated issue.
 */
async function updateIssueState (issueId, stateEvent) {
  const response = await fetch(
    `https://gitlab.lnu.se/api/v4/projects/${process.env.PROJECT_ID}/issues/${issueId}`,
    {
      method: 'PUT',
      headers: {
        'PRIVATE-TOKEN': process.env.GITLAB_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ state_event: stateEvent }),
    }
  )
  return response.json()
}

//****** wrappers for close and reopen issue functions ******//

/**
 * Closes an issue in the GitLab API.
 *
 * @param {number} issueId - The ID of the issue to close.
 * @returns {Promise<object>} A promise that resolves to the updated issue.
 */
export const closeIssue = async (issueId) => {
  return updateIssueState(issueId, 'close')
}

/**
 * Reopens an issue in the GitLab API.
 *
 * @param {number} issueId - The ID of the issue to reopen.
 * @returns {Promise<object>} A promise that resolves to the updated issue.
 */
export const reopenIssue = async (issueId) => {
  return updateIssueState(issueId, 'reopen')
}