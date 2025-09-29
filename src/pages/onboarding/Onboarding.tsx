import {useNavigate} from "react-router-dom";
import {Path} from "../../routes/Paths.ts";
import {useUser} from "../../contexts/UserContext.tsx";
import axios, {HttpStatusCode} from "axios";
import {MEMBER_SETTING} from "../../api/Api.ts";
import type {ChangeEvent, FormEvent} from "react";
import {useEffect, useState} from "react";
import type {SettingDto} from "../setting/dto/setting.dto.ts";
import {InitialSettingDto} from "../setting/dto/setting.dto.ts";
import {MemberRole} from "../../constants/MemberRole.ts";

export const Onboarding = () => {
    const navigate = useNavigate();
    const {user} = useUser();
    const [setting, setSetting] = useState<SettingDto>(InitialSettingDto());

    useEffect(() => {
        if (user) {
            checkUserSettings(user.id);
        }
    }, [user]);

    const checkUserSettings = (userId: number) => {
        axios.get(MEMBER_SETTING(userId)).then(response => {
            if (response.status === HttpStatusCode.Ok) {
                navigate(Path.HOME);
            } else {
                console.log(response);
            }
        }).catch(error => {
            console.log(error);
        });
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, checked, value} = e.target;

        if (name === "isAlarmOn") {
            setSetting((prev) => ({...prev, isAlarmOn: checked}));
        } else if (name === "alarmDays") {
            const day = parseInt(value);
            setSetting((prev) => {
                if (checked) {
                    return {...prev, alarmDays: [...prev.alarmDays, day]};
                } else {
                    return {...prev, alarmDays: prev.alarmDays.filter((d) => d !== day)};
                }
            });
        } else if (name === "storage") {
            setSetting((prev) => {
                if (checked) {
                    return {...prev, storages: [...prev.storages, value]};
                } else {
                    return {...prev, storages: prev.storages.filter((s) => s !== value)};
                }
            });
        } else if (name === "theme") {
            setSetting((prev) => ({...prev, theme: value.toUpperCase()})); // LIGHT / DARK
        }
    }

    const saveSettings = (event: FormEvent) => {
        event.preventDefault();
        if (!user) return;

        axios.post(MEMBER_SETTING(user.id), setting)
            .then(() => {
                navigate(Path.HOME);
            })
            .catch(error => {
                console.log(error);
                alert("설정 저장 중 오류가 발생했습니다.");
            });
    }

    return (
        <>
            <main className="card" aria-labelledby="title">
                <header className="header">
                    <div className="logo" id="title" aria-label="푸디언 온보딩">
                        <span className="logo-badge">F</span>
                        <span>푸디언</span>
                    </div>
                    <p className="subtitle">처음 오셨어요! 기본 설정을 완료해 주세요.</p>
                </header>

                <form>
                    <section className="field" aria-labelledby="exp-noti-title">
                        <label
                            id="exp-noti-title"
                            style={{fontWeight: 700, color: "var(--text)"}}
                        >
                            1. 유통기한 알림 설정
                        </label>

                        <div
                            className="row"
                            style={{justifyContent: "flex-start", gap: 16, paddingLeft: 0}}
                        >
                            <label className="checkbox">
                                <input type="checkbox" id="isAlarmOn" name="isAlarmOn" checked={setting.isAlarmOn}
                                       onChange={handleChange}/>
                                ON
                            </label>
                            <span
                                className="checkbox"
                                style={{cursor: "default", color: "var(--muted)"}}
                            >
            / OFF는 체크 해제
          </span>
                        </div>

                        <div
                            className="row"
                            style={{
                                flexWrap: "wrap",
                                gap: 12,
                                justifyContent: "flex-start",
                                paddingLeft: 0,
                            }}
                            aria-label="알림 시점 선택(복수 선택 가능)"
                        >
                            <label className="checkbox">
                                <input
                                    type="checkbox"
                                    className="notify-day"
                                    name="alarmDays"
                                    value="1"
                                    checked={setting.alarmDays.includes(1)}
                                    onChange={handleChange}
                                />
                                1일 전
                            </label>
                            <label className="checkbox">
                                <input
                                    type="checkbox"
                                    className="notify-day"
                                    name="alarmDays"
                                    value="3"
                                    checked={setting.alarmDays.includes(3)}
                                    onChange={handleChange}
                                />
                                3일 전
                            </label>
                            <label className="checkbox">
                                <input
                                    type="checkbox"
                                    className="notify-day"
                                    name="alarmDays"
                                    value="5"
                                    checked={setting.alarmDays.includes(5)}
                                    onChange={handleChange}
                                />
                                5일 전
                            </label>
                        </div>
                    </section>

                    <div className="divider" role="separator" aria-label="구분선"></div>

                    <section className="field" aria-labelledby="storage-title">
                        <label
                            id="storage-title"
                            style={{fontWeight: 700, color: "var(--text)"}}
                        >
                            2. 저장소 설정
                            {user?.role === MemberRole.MEMBER && <span className="only-leader-storage">* 리더만 가능</span>}
                        </label>
                        <div
                            className="row"
                            style={{
                                flexWrap: "wrap",
                                gap: 12,
                                justifyContent: "flex-start",
                                paddingLeft: 0,
                            }}
                        >
                            <label className="checkbox">
                                <input
                                    type="checkbox"
                                    name="storage"
                                    value="냉장"
                                    checked={setting.storages.includes("냉장")}
                                    onChange={handleChange}
                                    disabled={user?.role === MemberRole.MEMBER}
                                />
                                냉장
                            </label>
                            <label className="checkbox">
                                <input type="checkbox" name="storage" value="냉동"
                                       checked={setting.storages.includes("냉동")}
                                       onChange={handleChange}
                                       disabled={user?.role === MemberRole.MEMBER}/>
                                냉동
                            </label>
                            <label className="checkbox">
                                <input type="checkbox" name="storage" value="실온"
                                       checked={setting.storages.includes("실온")}
                                       onChange={handleChange}
                                       disabled={user?.role === MemberRole.MEMBER}/>
                                실온
                            </label>
                        </div>
                    </section>

                    <div className="divider" role="separator" aria-label="구분선"></div>

                    <section className="field" aria-labelledby="theme-title">
                        <label
                            id="theme-title"
                            style={{fontWeight: 700, color: "var(--text)"}}
                        >
                            3. 색상 테마
                        </label>
                        <div
                            className="row"
                            style={{
                                flexWrap: "wrap",
                                gap: 12,
                                justifyContent: "flex-start",
                                paddingLeft: 0,
                            }}
                        >
                            <label className="checkbox">
                                <input type="radio" name="theme" value="LIGHT" checked={setting.theme === "LIGHT"}
                                       onChange={handleChange}/>
                                라이트
                            </label>
                            <label className="checkbox">
                                <input type="radio" name="theme" value="DARK" checked={setting.theme === "DARK"}
                                       onChange={handleChange}/>
                                다크
                            </label>
                        </div>
                    </section>

                    <div className="divider" role="separator" aria-label="구분선">
                        설정
                    </div>

                    <div className="actions">
                        <button onClick={saveSettings} className="btn btn-primary">설정 완료</button>
                    </div>

                    <footer>
                        © <span id="year"></span> 푸디언 • All rights reserved.
                    </footer>
                </form>
            </main>
        </>

    )
}