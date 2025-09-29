export const MemberRole = {
    LEADER: "LEADER",
    MEMBER: "MEMBER",
} as const;

export type MemberRole = typeof MemberRole[keyof typeof MemberRole];