export const environment = {
    production: false,
    apirurl: 'http://localhost:3000/api/v1/auth/login'
};
export const userApi = {
    production: false,
    apirurl: 'http://localhost:3000/api/v1/auth/profile',
    baseUrl: 'http://localhost:3000/api/v1/users'
}

export const projectApi = {
    production: false,
    getOnlyOwn:'http://localhost:3000/api/v1/project/user/projects',
    getAll: 'http://localhost:3000/api/v1/project/',
    getById: 'http://localhost:3000/api/v1/project',
    create: 'http://localhost:3000/api/v1/project',
    update: 'http://localhost:3000/api/v1/project',
}

export const taskApi = {
    production: false,
    getOnlyOwn:'http://localhost:3000/api/v1/tasks/user/tasks',
    getById: 'http://localhost:3000/api/v1/task',

}

export const subtaskApi = {
    production: false,
    apiUrl: 'http://localhost:3000/api/v1/subtasks'
}

export const issueApi ={
    production: false,
    apiUrl: 'http://localhost:3000/api/v1/issues'
}

export const commentApi = {
    production: false,
    apiUrl: 'http://localhost:3000/api/v1/comments',
    findOne: 'http://localhost:3000/api/v1/comments',
    findAll: 'http://localhost:3000/api/v1/comments',
    create: 'http://localhost:3000/api/v1/comments'
}
  