export  interface RegisterInput{
    username: string;
    email: string;
    password: string;
}

export interface LoginInput{
    email: string;
    password: string;
}

export interface UpdateProfileInput{
    username?: string;
   // password?: string;
    avatar?: string;
    bio?: string;
}

export interface CreateBlogInput{
    title: string;
    content: string;
    image?: string;
    published?: boolean;
}

export interface UpdateBlogInput{
    title?: string;
    content?: string;
    image?: string;
    published?: boolean;
}