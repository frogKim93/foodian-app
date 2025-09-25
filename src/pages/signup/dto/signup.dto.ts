export interface SignupDto {
    username: string;
    password: string;
    name: string;
}

export const InitialSignupDto = (): SignupDto => {
    return {
        username: "",
        password: "",
        name: ""
    }
}