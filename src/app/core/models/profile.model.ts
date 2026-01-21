export interface Profile{
    id?: number;
    fullName: string;
    title:string;
    bio:string;
    email:string;
    phone?:string;
    location?:string;
    githubUrl?:string;
    linkedinUrl?:string;
    resumeUrl?:string;
    profileImageUrl?:string;
}