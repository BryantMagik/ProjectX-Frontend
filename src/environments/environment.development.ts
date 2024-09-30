export const environment = {
    production: false,
    apirurl: 'http://localhost:3000/api/v1/auth/login'
};
export const userApi = {
    production: false,
    apirurl: 'http://localhost:3000/api/v1/auth/profile'
}

export const projectApi = {
    production: false,
    getOnlyOwn:'http://localhost:3000/api/v1/project/user/projects',
    getAll: 'http://localhost:3000/api/v1/project/',
    getById: 'http://localhost:3000/api/v1/project',
    create: 'http://localhost:3000/api/v1/project'
}
