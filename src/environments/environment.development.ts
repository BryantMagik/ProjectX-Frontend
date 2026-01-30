// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/v1/'
};

export const apiRoutes = {
  production: false,
  auth: {
    login: `${environment.apiUrl}auth/login`,
    profile: `${environment.apiUrl}auth/profile`,
    refresh: `${environment.apiUrl}auth/refresh`,
    logout: `${environment.apiUrl}auth/logout`,
  },
  project: {
    create: `${environment.apiUrl}project`,
    getOnlyOwn: `${environment.apiUrl}project/user/projects/`,
    getAll: `${environment.apiUrl}project/`,
    getAllProjectsByWorkspaceId: `${environment.apiUrl}project/workspace`,
    getById: `${environment.apiUrl}project/id`,
    update: `${environment.apiUrl}project`
  },
  task: {
    getOnlyOwn: `${environment.apiUrl}tasks/user/tasks/`,
    getById: `${environment.apiUrl}user/tasks/`,
    getTaskByProjectId: `${environment.apiUrl}tasks/project`,
  },
  subtask: {
    apiUrl: `${environment.apiUrl}subtasks`,
    getOnlyOwn: `${environment.apiUrl}subtasks/user/subtasks`,
    getById: `${environment.apiUrl}subtasks/id`
  },
  issue: {
    apiUrl: `${environment.apiUrl}issues`,
    getOnlyOwn: `${environment.apiUrl}issues/user/issues`,
    getById: `${environment.apiUrl}issues/id`
  },
  comment: {
    apiUrl: `${environment.apiUrl}comments`,
    getOnlyOwn: `${environment.apiUrl}comments/user/comments`,
    getByTask: (taskId: string) => `${environment.apiUrl}comments/tasks/${taskId}`,
    getByIssue: (issueId: string) => `${environment.apiUrl}comments/issues/${issueId}`,
    getById: `${environment.apiUrl}comments/id`
  },
  workspace: {
    create: `${environment.apiUrl}workspace`,
    getAll: `${environment.apiUrl}workspace/`,
    getById: `${environment.apiUrl}workspace`,
    update: `${environment.apiUrl}workspace`,
    delete: `${environment.apiUrl}workspace`,
  },
  users: {
    getAll: `${environment.apiUrl}users/`,
  }
};
