export interface SettingDto {
    isAlarmOn: boolean;
    alarmDays: number[];
    storages: string[];
    theme: string;
}

export const InitialSettingDto = (): SettingDto => {
    return {
        isAlarmOn: true,
        alarmDays: [1],
        storages: ["냉장", "냉동", "실온"],
        theme: "LIGHT"
    }
}