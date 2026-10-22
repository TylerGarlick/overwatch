export async function graphqlRequest<T>(
  url: string,
  token: string,
  query: string,
  variables: Record<string, any> = {}
): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });

  const result = await response.json();

  if (result.errors) {
    throw new Error(`GraphQL Error: ${JSON.stringify(result.errors)}`);
  }

  return result.data;
}

export const gitlabClient = {
  // Server-side call
  serverRequest: <T>(query: string, variables?: Record<string, any>) =>
    graphqlRequest<T>(
      process.env.GITLAB_API_URL!,
      process.env.GITLAB_PERSONAL_ACCESS_TOKEN!,
      query,
      variables
    ),
  // Client-side call via proxy
  clientRequest: <T>(query: string, variables?: Record<string, any>) =>
    graphqlRequest<T>(
      '/api/proxy/gitlab',
      '', // Token is handled by the proxy server
      query,
      variables
    ),
};

export const ms365Client = {
  // Server-side call
  serverRequest: <T>(token: string, query: string, variables?: Record<string, any>) =>
    graphqlRequest<T>(
      process.env.MS365_API_URL!,
      token,
      query,
      variables
    ),
  // Client-side call via proxy
  clientRequest: <T>(token: string, query: string, variables?: Record<string, any>) =>
    graphqlRequest<T>(
      '/api/proxy/ms365',
      token, // Proxy forwards this
      query,
      variables
    ),
};
