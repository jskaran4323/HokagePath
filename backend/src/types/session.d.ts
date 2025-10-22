import 'express-session'

declare module 'expression-session'{
    interface SessionData{
        userId: string;
        username: string;
        email: string
    }
}