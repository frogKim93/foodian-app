import {useNavigate} from "react-router-dom";
import {Path} from "../../routes/Paths.ts";

export const Onboarding = () => {
    const navigate = useNavigate();

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

                <form noValidate>
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
                                <input type="checkbox" id="notify_on" name="notify_on"/>
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
                                    name="notify_days"
                                    value="1"
                                    disabled
                                />
                                1일 전
                            </label>
                            <label className="checkbox">
                                <input
                                    type="checkbox"
                                    className="notify-day"
                                    name="notify_days"
                                    value="3"
                                    disabled
                                />
                                3일 전
                            </label>
                            <label className="checkbox">
                                <input
                                    type="checkbox"
                                    className="notify-day"
                                    name="notify_days"
                                    value="5"
                                    disabled
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
                                    value="refrigerated"
                                    defaultChecked
                                />
                                냉장
                            </label>
                            <label className="checkbox">
                                <input type="checkbox" name="storage" value="frozen"/>
                                냉동
                            </label>
                            <label className="checkbox">
                                <input type="checkbox" name="storage" value="room"/>
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
                                <input type="radio" name="theme" value="light"/>
                                라이트
                            </label>
                            <label className="checkbox">
                                <input type="radio" name="theme" value="dark" defaultChecked/>
                                다크
                            </label>
                        </div>
                    </section>

                    <div className="divider" role="separator" aria-label="구분선"></div>

                    <div className="actions">
                        <button onClick={() => navigate(Path.HOME)} className="btn btn-primary">설정 완료</button>
                        <button onClick={() => navigate(Path.HOME)} className="btn" aria-label="건너뛰기">나중에 설정하기</button>
                    </div>

                    <footer>
                        © <span id="year"></span> 푸디언 • All rights reserved.
                    </footer>
                </form>
            </main>
        </>

    )
}