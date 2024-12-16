const baseUrl = 'https://project-x-backend-lyart.vercel.app/api/v1/';

export const apiRoutes = {
    production: true,
    auth: {
        login: `${baseUrl}auth/login`,
        profile: `${baseUrl}auth/profile`,
    },
    project: {
        create: `${baseUrl}project`,
        getOnlyOwn: `${baseUrl}project/user/projects/`,
        getAllProjectsByWorkspaceId: `${baseUrl}project`,
        getAll: `${baseUrl}project/`,
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
