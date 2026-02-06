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
    { name: 'FEATURE', value: 'FEATURE' },
    { name: 'BUG', value: 'BUG' },
    { name: 'CHORE', value: 'CHORE' },
    { name: 'IMPROVEMENT', value: 'IMPROVEMENT' },
    { name: 'HOTFIX', value: 'HOTFIX' },
]

export const TASKSSTATUS = [
    { name: 'BACKLOG', value: 'BACKLOG' },
    { name: 'TODO', value: 'TODO' },
    { name: 'IN_PROGRESS', value: 'IN_PROGRESS' },
    { name: 'REVIEW', value: 'REVIEW' },
    { name: 'DONE', value: 'DONE' },
]
