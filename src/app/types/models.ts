export interface ProyectDropdown {
    name: string,
    value: string,
}

export const PROYECTOTYPE = [
    { name: 'Internal', value: 'INTERNAL' },
    { name: 'External', value: 'EXTERNAL' },
    { name: 'Research', value: 'RESEARCH' },
    { name: 'Software', value: 'SOFTWARE' },
];

export const PROYECTOSTATUS = [
    { name: 'Inactive', value: 'ONWAIT' },
    { name: 'On going', value: 'ONGOING' },
    { name: 'Completed', value: 'COMPLETED' },
]

export const PROYECTOVISIBILITY = [
    { name: 'Private', value: 'PRIVATE' },
    { name: 'Public', value: 'PUBLIC' },
]

export const TASKSTYPE = [
    { name: 'BUG', value: 'BUG' },
    { name: 'FEATURE_REQUEST', value: 'FEATURE_REQUEST' },
    { name: 'BACKLOG', value: 'BACKLOG' },
    { name: 'TODO', value: 'TODO' },
    { name: 'IN_PROGRESS', value: 'IN_PROGRESS' },
    { name: 'IN_REVIEW', value: 'IN_REVIEW' },
    { name: 'DONE', value: 'DONE' },
]

export const TASKSSTATUS = [
    { name: 'PENDING', value: 'PENDING' },
    { name: 'ONGOING', value: 'ONGOING' },
    { name: 'COMPLETED', value: 'COMPLETED' },
]
