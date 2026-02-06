export interface User {
    id: string;
    email: string;
    first_name: string
    profile_picture: string
    last_name: string
    type_user: 'TRAINEE' | 'DEVELOPER' | 'MANAGER' | 'DESIGNER' | 'QA' | 'PRODUCT_OWNER';
    role?: string
    createdAt: string
    updatedAt: string
}