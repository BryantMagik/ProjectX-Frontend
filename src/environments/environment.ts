// environment.prod.ts
export const environment = {
    production: true,
    apiUrl: 'https://project-x-backend-lyart.vercel.app/api/v1/'
}

export const apiRoutes = {
  production: true,
    auth: {
      login: `${environment.apiUrl}auth/login`,
      profile: `${environment.apiUrl}auth/profile`,
    },
    project: {
      create: `${environment.apiUrl}project`,
      getOnlyOwn: `${environment.apiUrl}project/user/projects/`,
      getAll: `${environment.apiUrl}project/`,
      getAllProjectsByWorkspaceId: `${environment.apiUrl}project`,
      getById: `${environment.apiUrl}project`,
      update: `${environment.apiUrl}project`
    },
    task: {
      getOnlyOwn: `${environment.apiUrl}tasks/user/tasks/`,
      getById: `${environment.apiUrl}user/tasks/`
    },
    subtask: {
      apiUrl: `${environment.apiUrl}subtasks`,
      getOnlyOwn: `${environment.apiUrl}subtasks/user/subtasks`
    },
    issue: {
      apiUrl: `${environment.apiUrl}issues`,
      getOnlyOwn: `${environment.apiUrl}issues/user/issues`
    },
    comment: {
      apiUrl: `${environment.apiUrl}comments`,
      getOnlyOwn: `${environment.apiUrl}comments/user/comments`
    },
    workspace: {
      create: `${environment.apiUrl}workspace`,
      getAll: `${environment.apiUrl}workspace/`
    },
    users: {
      getAll: `${environment.apiUrl}users/`,
    }
  };
