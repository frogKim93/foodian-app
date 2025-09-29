export const API_SERVER: string = "http://125.143.81.30:8080";

export const SIGNUP_API: string = `${API_SERVER}/signup`;
export const LOGIN_API: string = `${API_SERVER}/login`;
export const SETTING_API: string = `${API_SERVER}/setting`;
export const MEMBER_SETTING: (memberId: number) => string = (memberId: number) => `${SETTING_API}/member/${memberId}`;

export const FAMILY_API: string = `${API_SERVER}/family`;
export const GET_FAMILY: (memberId: number) => string = (memberId: number) => `${FAMILY_API}?memberId=${memberId}`;
export const CREATE_FAMILY: (memberId: number) => string = (memberId: number) => `${FAMILY_API}?memberId=${memberId}`;
export const JOIN_FAMILY: (memberId: number, familyCode: string) => string = (memberId: number, familyCode: string) => `${FAMILY_API}/join?memberId=${memberId}&code=${familyCode}`;