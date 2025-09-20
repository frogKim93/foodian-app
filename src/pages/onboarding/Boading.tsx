import { useEffect, useMemo, useState } from "react";
import {useNavigate} from "react-router-dom";
import {Path} from "../../routes/Paths.ts";

/** ====== 타입 & 상수 (enum 대신 as const 사용) ====== */
export const THEME = {
    LIGHT: "light",
    DARK: "dark",
    SYSTEM: "system",
} as const;
export type Theme = typeof THEME[keyof typeof THEME];

export const STORAGE = {
    FRIDGE: "냉장",
    FREEZER: "냉동",
    PANTRY: "실온",
} as const;
export type StorageKind = typeof STORAGE[keyof typeof STORAGE];

type OnboardingSettings = {
    // 알림
    notificationsEnabled: boolean;
    // 유통기한 D-기준 (예: D-1, D-3, D-7)
    notifyDaysBefore: number[]; // [1,3,7] 등 중복 선택
    // 알림 시간 (HH:mm, 24h)
    notifyTime: string;

    // 보관소 (복수 선택)
    storages: StorageKind[];

    // 테마
    theme: Theme;
};

const DEFAULT_SETTINGS: OnboardingSettings = {
    notificationsEnabled: true,
    notifyDaysBefore: [1, 3, 7],
    notifyTime: "09:00",
    storages: [STORAGE.FRIDGE, STORAGE.FREEZER, STORAGE.PANTRY],
    theme: THEME.SYSTEM,
};

const LS_KEY = "foodian:onboarding";

/** ====== 유틸 ====== */
function loadSettings(): OnboardingSettings {
    try {
        const raw = localStorage.getItem(LS_KEY);
        if (!raw) return DEFAULT_SETTINGS;
        const parsed = JSON.parse(raw);
        // 간단 검증 & 기본값 머지
        return {
            ...DEFAULT_SETTINGS,
            ...parsed,
            notifyDaysBefore: Array.isArray(parsed?.notifyDaysBefore)
                ? parsed.notifyDaysBefore.map(Number).filter((n: number) => Number.isFinite(n) && n >= 0)
                : DEFAULT_SETTINGS.notifyDaysBefore,
            storages: Array.isArray(parsed?.storages) && parsed.storages.length
                ? parsed.storages
                    .filter((s: unknown): s is StorageKind =>
                        Object.values(STORAGE).includes(s as StorageKind)
                    )
                : DEFAULT_SETTINGS.storages,
            theme: Object.values(THEME).includes(parsed?.theme) ? parsed.theme : DEFAULT_SETTINGS.theme,
            notificationsEnabled: !!parsed?.notificationsEnabled,
            notifyTime:
                typeof parsed?.notifyTime === "string" && /^\d{2}:\d{2}$/.test(parsed.notifyTime)
                    ? parsed.notifyTime
                    : DEFAULT_SETTINGS.notifyTime,
        };
    } catch {
        return DEFAULT_SETTINGS;
    }
}

function saveSettings(s: OnboardingSettings) {
    localStorage.setItem(LS_KEY, JSON.stringify(s));
}

/** ====== 체크박스 유틸 ====== */
function toggleInArray<T>(list: T[], value: T): T[] {
    return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

/** ====== 온보딩 컴포넌트 ====== */
export const Onboarding = () => {
    const [settings, setSettings] = useState<OnboardingSettings>(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState<null | "ok" | "error">(null);
    const navigate = useNavigate();

    useEffect(() => {
        setSettings(loadSettings());
        setLoading(false);
    }, []);

    const dayOptions = useMemo(() => [1, 3, 7], []);
    const storageOptions = useMemo<StorageKind[]>(
        () => [STORAGE.FRIDGE, STORAGE.FREEZER, STORAGE.PANTRY],
        []
    );
    const themeOptions = useMemo<Theme[]>(
        () => [THEME.SYSTEM, THEME.LIGHT, THEME.DARK],
        []
    );

    const handleSave = () => {
        // 간단 검증
        if (settings.notificationsEnabled) {
            if (!settings.notifyDaysBefore.length) {
                alert("알림을 켰다면 최소 1개 이상의 D-일 기준을 선택하세요.");
                return;
            }
            if (!/^\d{2}:\d{2}$/.test(settings.notifyTime)) {
                alert("알림 시간 형식이 올바르지 않습니다. 예) 09:00");
                return;
            }
        }
        if (!settings.storages.length) {
            alert("최소 1개 이상의 보관소를 선택하세요.");
            return;
        }

        try {
            saveSettings(settings);
            setSaved("ok");
            console.log("[Onboarding] Saved:", settings);
            navigate(Path.HOME);
        } catch (e) {
            console.error(e);
            setSaved("error");
        }
    };

    if (loading) return null;

    return (
        <div>
            <h3>온보딩</h3>

            {/* ===== 알림 ===== */}
            <section>
                <h4>알림</h4>
                <label>
                    <input
                        type="checkbox"
                        checked={settings.notificationsEnabled}
                        onChange={(e) =>
                            setSettings((s) => ({ ...s, notificationsEnabled: e.target.checked }))
                        }
                    />
                    알림 사용
                </label>

                {/* D-일 기준 멀티선택 */}
                <div>
                    <div>유통기한 D-기준</div>
                    {dayOptions.map((d) => (
                        <label key={d} style={{ marginRight: 12 }}>
                            <input
                                type="checkbox"
                                checked={settings.notifyDaysBefore.includes(d)}
                                disabled={!settings.notificationsEnabled}
                                onChange={() =>
                                    setSettings((s) => ({
                                        ...s,
                                        notifyDaysBefore: toggleInArray(s.notifyDaysBefore, d).sort((a, b) => a - b),
                                    }))
                                }
                            />
                            D-{d}
                        </label>
                    ))}
                </div>

                {/* 알림 시간 */}
                <div style={{ marginTop: 8 }}>
                    <label>
                        알림 시간&nbsp;
                        <input
                            type="time"
                            value={settings.notifyTime}
                            disabled={!settings.notificationsEnabled}
                            onChange={(e) =>
                                setSettings((s) => ({ ...s, notifyTime: e.target.value }))
                            }
                        />
                    </label>
                </div>
            </section>

            <hr />

            {/* ===== 보관소 ===== */}
            <section>
                <h4>냉장고</h4>
                {storageOptions.map((sk) => (
                    <label key={sk} style={{ marginRight: 12 }}>
                        <input
                            type="checkbox"
                            checked={settings.storages.includes(sk)}
                            onChange={() =>
                                setSettings((s) => ({
                                    ...s,
                                    storages: toggleInArray(s.storages, sk),
                                }))
                            }
                        />
                        {sk}
                    </label>
                ))}
            </section>

            <hr />

            {/* ===== 테마 ===== */}
            <section>
                <h4>테마</h4>
                {themeOptions.map((t) => (
                    <label key={t} style={{ marginRight: 12 }}>
                        <input
                            type="radio"
                            name="theme"
                            value={t}
                            checked={settings.theme === t}
                            onChange={() => setSettings((s) => ({ ...s, theme: t }))}
                        />
                        {t === THEME.SYSTEM ? "시스템" : t === THEME.LIGHT ? "라이트" : "다크"}
                    </label>
                ))}
            </section>

            <div style={{ marginTop: 16 }}>
                <button type="button" onClick={handleSave}>저장</button>
                {saved === "ok" && <span style={{ marginLeft: 8 }}>저장됨</span>}
                {saved === "error" && <span style={{ marginLeft: 8, color: "red" }}>저장 실패</span>}
            </div>
        </div>
    );
};
