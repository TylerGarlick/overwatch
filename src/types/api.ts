export interface GitLabProject {
  id: string;
  name: string;
  path: string;
}

export interface MS365ListItem {
  id: string;
  fields: Record<string, any>;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}
