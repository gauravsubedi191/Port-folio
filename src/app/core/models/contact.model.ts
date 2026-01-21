export interface ContactMessage {
    id?: number;
    name:string;
    email:string;
    subject?:string;
    message:string;
    isRead?:boolean;
    createdAt?:string;
}

export interface LoginRequest{
    username: string;
    password: string;
}

export interface LoginResponse{
    token: string;
    type: string;
    username:string;
    email:string;
}