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
    `https://gitlab.lnu.se/api/v4/projects/${process.env.PROJECT_ID}/issues`,
    { headers: { 'PRIVATE-TOKEN': process.env.GITLAB_TOKEN } }
  )
  return response.json()
}
