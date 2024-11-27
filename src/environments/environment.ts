export const environment = {
    production: true,
    apirurl: 'https://project-x-backend-lyart.vercel.app/api/v1/auth/login'
};

export const userApi = {
    production: true,
    apirurl: 'https://project-x-backend-lyart.vercel.app/api/v1/auth/profile',
    baseUrl: 'https://project-x-backend-lyart.vercel.app/api/v1/users'

}

export const projectApi = {
    production: true,
    getOnlyOwn: 'https://project-x-backend-lyart.vercel.app/api/v1/project/user/projects/',
    getAll: 'https://project-x-backend-lyart.vercel.app/api/v1/project/',
    getById: 'https://project-x-backend-lyart.vercel.app/api/v1/project',
    create: 'https://project-x-backend-lyart.vercel.app/api/v1/project',
    update: 'https://project-x-backend-lyart.vercel.app/api/v1/project'
}

export const taskApi = {
    production: true,
    getOnlyOwn: 'https://project-x-backend-lyart.vercel.app/api/v1/tasks/user/tasks/',
    getById: 'https://project-x-backend-lyart.vercel.app/api/v1/user/tasks/',

}

export const subtaskApi = {
    production: false,
    apiUrl: 'https://project-x-backend-lyart.vercel.app/api/v1/subtasks',
    getOnlyOwn:'https://project-x-backend-lyart.vercel.app/api/v1/subtasks/user/subtasks',
}

export const issueApi ={
    production: false,
    apiUrl: 'https://project-x-backend-lyart.vercel.app/api/v1/issues',
    getOnlyOwn:'https://project-x-backend-lyart.vercel.app/api/v1/issues/user/issues',
}

export const commentApi = {
    production: false,
    apiUrl: 'https://project-x-backend-lyart.vercel.app/api/v1/comments',
    getOnlyOwn:'https://project-x-backend-lyart.vercel.app/api/v1/comments/user/comments',
}