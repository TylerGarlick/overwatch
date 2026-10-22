/**
 * API Usage Examples for Overwatch
 */

import { gitlabClient, ms365Client } from '@/lib/graphql';

// 1. GitLab API Example (Client-side)
async function fetchGitLabProjects() {
  const query = `
    query {
      projects {
        nodes {
          name
          webUrl
        }
      }
    }
  `;
  try {
    const data = await gitlabClient.clientRequest(query);
    console.log('GitLab Projects:', data);
  } catch (e) {
    console.error('Error fetching GitLab projects:', e);
  }
}

// 2. MS365 API Example (Client-side)
async function fetchMS365Lists(token: string) {
  const query = `
    query {
      lists {
        nodes {
          displayName
          id
        }
      }
    }
  `;
  try {
    const data = await ms365Client.clientRequest(token, query);
    console.log('MS365 Lists:', data);
  } catch (e) {
    console.error('Error fetching MS365 lists:', e);
  }
}

// 3. Server-side Example (e.g. in a Next.js Server Component)
async function serverSideFetch() {
  const query = `{ project(fullPath: "my-group/my-repo") { name } }`;
  const data = await gitlabClient.serverRequest(query);
  return data;
}
