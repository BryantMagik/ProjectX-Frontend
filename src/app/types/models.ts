export interface ProyectDropdown {
    name: string,
    value: string,
}

export const PROYECTOTYPE = [
    { name: 'INTERNAL', value: 'INTERNAL' },
    { name: 'EXTERNAL', value: 'EXTERNAL' },
    { name: 'RESEARCH', value: 'RESEARCH' },
    { name: 'SOFTWARE', value: 'SOFTWARE' },
];

export const PROYECTOSTATUS = [
    { name: 'Inactive', value: 'ONWAIT' },
    { name: 'On going', value: 'ONGOING' },
    { name: 'Completed', value: 'COMPLETED' },

]