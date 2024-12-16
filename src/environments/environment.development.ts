export const baseUrl = 'http://localhost:3000/api/v1/';
export const apiRoutes = {
  production: false,
  auth: {
    login: `${baseUrl}auth/login`,
    profile: `${baseUrl}auth/profile`,
  },
  project: {
    create: `${baseUrl}project`,
    getOnlyOwn: `${baseUrl}project/user/projects/`,
    getAll: `${baseUrl}project/`,
    getAllProjectsByWorkspaceId: `${baseUrl}project`,
    getById: `${baseUrl}project`,
    update: `${baseUrl}project`
  },
  task: {
    getOnlyOwn: `${baseUrl}tasks/user/tasks/`,
    getById: `${baseUrl}user/tasks/`
  },
  subtask: {
    apiUrl: `${baseUrl}subtasks`,
    getOnlyOwn: `${baseUrl}subtasks/user/subtasks`
  },
  issue: {
    apiUrl: `${baseUrl}issues`,
    getOnlyOwn: `${baseUrl}issues/user/issues`
  },
  comment: {
    apiUrl: `${baseUrl}comments`,
    getOnlyOwn: `${baseUrl}comments/user/comments`
  },
  workspace: {
    create: `${baseUrl}workspace`,
    getAll: `${baseUrl}workspace/`
  },
  users: {
    getAll: `${baseUrl}users/`,
  }
};
