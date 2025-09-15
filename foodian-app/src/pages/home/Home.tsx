import {useEffect, useMemo, useState} from "react";

type StorageType = "냉장" | "냉동" | "실온";
type ActivityType = "add" | "edit" | "consume" | "delete";

interface ExpiringItem {
    id: string;
    name: string;
    qty: number;
    unit?: string;
    storage: StorageType;
    expiryDate: string; // YYYY-MM-DD
    owner?: string;
    updatedAt?: string;
}

interface Activity {
    id: string;
    type: ActivityType;
    itemName: string;
    deltaQty?: number;
    actor: string;
    storage?: StorageType;
    at: string; // ISO string
}

export const Home = () => {
    // ---- state ----
    const [expiringItems, setExpiringItems] = useState<ExpiringItem[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [memos, setMemos] = useState<{ id: string; text: string; checked: boolean }[]>([]);
    const [memoInput, setMemoInput] = useState("");

    // ---- mock / load ----
    useEffect(() => {
        // TODO: API로 교체
        setExpiringItems([
            { id: "1", name: "우유", qty: 1, storage: "냉장", expiryDate: "2025-09-15" },
            { id: "2", name: "닭가슴살", qty: 2, storage: "냉동", expiryDate: "2025-09-16" }
        ]);
        setActivities([
            { id: "a1", type: "add", itemName: "우유", deltaQty: 2, actor: "민지", at: new Date().toISOString() },
            { id: "a2", type: "consume", itemName: "사과", deltaQty: 1, actor: "지훈", at: new Date().toISOString() }
        ]);

        const raw = localStorage.getItem("shoppingMemo");
        if (raw) setMemos(JSON.parse(raw));
    }, []);

    useEffect(() => {
        localStorage.setItem("shoppingMemo", JSON.stringify(memos));
    }, [memos]);

    // ---- helpers ----
    const KST_OFFSET = 9 * 60 * 60 * 1000;
    const daysUntil = (dateStr: string) => {
        const [y, m, d] = dateStr.split("-").map(Number);
        const target = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
        const now = new Date();
        const diff = target.getTime() + KST_OFFSET - (now.getTime() + KST_OFFSET);
        return Math.floor(diff / (24 * 60 * 60 * 1000));
    };

    const expiringList = useMemo(() =>
            expiringItems
                .map(it => ({ ...it, dday: daysUntil(it.expiryDate) }))
                .filter(it => it.dday <= 3)
                .sort((a, b) => (a.dday - b.dday) || a.name.localeCompare(b.name)),
        [expiringItems]
    );

    // ---- memo functions ----
    const addMemo = () => {
        const text = memoInput.trim();
        if (!text) return;
        setMemos(prev => [...prev, { id: crypto.randomUUID(), text, checked: false }]);
        setMemoInput("");
    };
    const toggleMemo = (id: string) => setMemos(prev =>
        prev.map(m => m.id === id ? { ...m, checked: !m.checked } : m)
    );
    const removeMemo = (id: string) => setMemos(prev => prev.filter(m => m.id !== id));
    const copyMemo = async () => {
        const text = memos.filter(m => !m.checked).map(m => m.text).join(", ");
        await navigator.clipboard.writeText(text);
        alert("메모 복사 완료");
    };

    const consumeItem = (id: string) =>
        setExpiringItems(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty - 1) } : i).filter(i => i.qty > 0));
    const removeItem = (id: string) =>
        setExpiringItems(prev => prev.filter(i => i.id !== id));

    // ---- render ----
    return (
        <main className="card" aria-labelledby="home-title">
            <header className="header">
                <div className="logo" id="home-title">
                    <span className="logo-badge">F</span>
                    <span>푸디언</span>
                </div>
                <p className="subtitle">오늘 필요한 것만, 가볍게 👋</p>
            </header>

            {/* 1. 유통기한 임박 */}
            <section className="field">
                <div className="row" style={{ justifyContent: "space-between" }}>
                    <h2 style={{ margin: 0 }}>임박 재료 ({expiringList.length})</h2>
                    <button className="btn" onClick={() => window.location.href = "/fridge?filter=expiring"}>
                        모두 보기 →
                    </button>
                </div>

                {expiringList.length === 0 && <div className="input" style={{ justifyContent: "center" }}>🎉 오늘 임박 재료 없음</div>}
                {expiringList.map(it => (
                    <div key={it.id} className="input" style={{ alignItems: "center" }}>
                        <span className="badge">D-{it.dday}</span>
                        <div style={{ flex: 1 }}>
                            <div>{it.name} <small className="chip">{it.storage}</small></div>
                            <small className="muted">수량 {it.qty}</small>
                        </div>
                        <button className="btn" onClick={() => consumeItem(it.id)}>소진</button>
                        <button className="btn" onClick={() => removeItem(it.id)}>삭제</button>
                    </div>
                ))}

                <button className="btn btn-primary" onClick={() => window.location.href = "/fridge"}>냉장고 열기</button>
            </section>

            <div className="divider"></div>

            {/* 2. 쇼핑 메모 */}
            <section className="field">
                <div className="row" style={{ justifyContent: "space-between" }}>
                    <h2 style={{ margin: 0 }}>장보기 메모</h2>
                    <button className="btn" onClick={copyMemo}>복사</button>
                </div>

                <div className="row" style={{ gap: 8 }}>
                    <div className="input" style={{ flex: 1 }}>
                        <input
                            value={memoInput}
                            onChange={(e) => setMemoInput(e.target.value)}
                            placeholder="예: 우유 2개"
                        />
                    </div>
                    <button className="btn btn-primary" onClick={addMemo}>추가</button>
                </div>

                {memos.map(m => (
                    <div key={m.id} className="input" style={{ alignItems: "center", gap: 12 }}>
                        <input
                            type="checkbox"
                            checked={m.checked}
                            onChange={() => toggleMemo(m.id)}
                        />
                        <div style={{ flex: 1, textDecoration: m.checked ? "line-through" : undefined }}>
                            {m.text}
                        </div>
                        <button className="btn" onClick={() => removeMemo(m.id)}>삭제</button>
                    </div>
                ))}
            </section>

            <div className="divider"></div>

            {/* 3. 멤버 활동 */}
            <section className="field">
                <div className="row" style={{ justifyContent: "space-between" }}>
                    <h2 style={{ margin: 0 }}>멤버 활동 (최근 24시간)</h2>
                    <button className="btn" onClick={() => alert("모두 읽음 처리(예시)")}>모두 읽음</button>
                </div>

                {activities.slice(0, 5).map(a => (
                    <div key={a.id} className="input" style={{ alignItems: "center" }}>
                        <span className="avatar">{a.actor.charAt(0)}</span>
                        <div style={{ flex: 1, padding: "0 8px" }}>
                            {a.actor}님이 {a.type === "add" && `${a.itemName} ${a.deltaQty ?? ""}개 추가`}
                            {a.type === "consume" && `${a.itemName} ${a.deltaQty ?? ""}개 소진`}
                            {a.type === "edit" && `${a.itemName} 변경`}
                            {a.type === "delete" && `${a.itemName} 삭제`}
                        </div>
                        <small className="muted">
                            {new Date(a.at).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
                        </small>
                    </div>
                ))}

                <button className="btn" onClick={() => window.location.href = "/activity"}>전체 보기 →</button>
            </section>
        </main>
    );
};
