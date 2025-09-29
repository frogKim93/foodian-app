export interface LoginDto {
    username: string;
    password: string;
}

export const InitialLoginDto = (): LoginDto => {
    return {
        username: "",
        password: "",
    }
}