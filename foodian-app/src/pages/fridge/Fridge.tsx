import { useEffect, useMemo, useState } from "react";

/** ===== 타입 & 상수 ===== */
export const STORAGE = { FRIDGE: "냉장", FREEZER: "냉동", PANTRY: "실온" } as const;
export type StorageKind = typeof STORAGE[keyof typeof STORAGE];

export type Item = {
    id: string;
    name: string;
    qty: number;
    unit: string;        // 개, g, 팩 등
    storage: StorageKind;
    expireDate: string;  // "YYYY-MM-DD"
    tags?: string[];
    addedAt: string;     // ISO
};

const LS_ITEMS = "foodian:items";

/** ===== 유틸 ===== */
function loadItems(): Item[] {
    try {
        return JSON.parse(localStorage.getItem(LS_ITEMS) || "[]");
    } catch {
        return [];
    }
}

function saveItems(items: Item[]) {
    localStorage.setItem(LS_ITEMS, JSON.stringify(items));
}

function isValidDateStr(s: string) {
    return /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(new Date(s).getTime());
}

/** ===== 메인 컴포넌트 ===== */
export const Fridge = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [storageFilter, setStorageFilter] = useState<StorageKind | "ALL">("ALL");
    const [sortKey, setSortKey] = useState<"EXPIRE" | "NAME" | "STORAGE">("EXPIRE");
    const [search, setSearch] = useState("");

    useEffect(() => {
        setItems(loadItems());
    }, []);

    /** 필터 + 정렬 + 검색 */
    const visible = useMemo(() => {
        let list = items;

        if (storageFilter !== "ALL") {
            list = list.filter(i => i.storage === storageFilter);
        }

        if (search.trim()) {
            const q = search.trim().toLowerCase();
            list = list.filter(
                i =>
                    i.name.toLowerCase().includes(q) ||
                    (i.tags || []).some(t => t.toLowerCase().includes(q))
            );
        }

        list = [...list].sort((a, b) => {
            if (sortKey === "EXPIRE") {
                return new Date(a.expireDate).getTime() - new Date(b.expireDate).getTime();
            }
            if (sortKey === "NAME") {
                return a.name.localeCompare(b.name);
            }
            // STORAGE
            const order: Record<StorageKind, number> = { 냉장: 0, 냉동: 1, 실온: 2 };
            return order[a.storage] - order[b.storage];
        });

        return list;
    }, [items, storageFilter, sortKey, search]);

    /** CRUD */
    const addItem = () => {
        const name = prompt("품목명? (예: 달걀)");
        if (!name) return;

        const qtyStr = prompt("수량? (숫자)", "1") || "1";
        const qty = Number(qtyStr);
        if (!Number.isFinite(qty) || qty < 0) {
            alert("수량이 올바르지 않습니다.");
            return;
        }

        const unit = prompt("단위? (예: 개, g, 팩)", "개") || "개";

        const storageIn = (prompt("보관소? (냉장/냉동/실온)", "냉장") || "냉장") as StorageKind;
        if (!["냉장", "냉동", "실온"].includes(storageIn)) {
            alert("보관소는 냉장/냉동/실온 중 하나여야 합니다.");
            return;
        }

        const expire = prompt("유효기간? (YYYY-MM-DD)", new Date(Date.now()+3*86400000).toISOString().slice(0,10)) || "";
        if (!isValidDateStr(expire)) {
            alert("유효기간 형식이 올바르지 않습니다.");
            return;
        }

        const next: Item = {
            id: crypto.randomUUID(),
            name,
            qty,
            unit,
            storage: storageIn,
            expireDate: expire,
            addedAt: new Date().toISOString(),
        };

        const updated = [...items, next];
        saveItems(updated);
        setItems(updated);
    };

    const editItem = (id: string) => {
        const it = items.find(i => i.id === id);
        if (!it) return;

        const name = prompt("품목명 수정", it.name) ?? it.name;

        const qtyStr = prompt("수량 수정(숫자)", String(it.qty));
        const qty = qtyStr === null ? it.qty : Number(qtyStr);
        if (!Number.isFinite(qty) || qty < 0) {
            alert("수량이 올바르지 않습니다.");
            return;
        }

        const unit = prompt("단위 수정", it.unit) ?? it.unit;

        const storageIn = (prompt("보관소 수정 (냉장/냉동/실온)", it.storage) ?? it.storage) as StorageKind;
        if (!["냉장", "냉동", "실온"].includes(storageIn)) {
            alert("보관소는 냉장/냉동/실온 중 하나여야 합니다.");
            return;
        }

        const expire = prompt("유효기간 수정 (YYYY-MM-DD)", it.expireDate) ?? it.expireDate;
        if (!isValidDateStr(expire)) {
            alert("유효기간 형식이 올바르지 않습니다.");
            return;
        }

        const updated = items.map(i =>
            i.id === id ? { ...i, name, qty, unit, storage: storageIn, expireDate: expire } : i
        );
        saveItems(updated);
        setItems(updated);
    };

    const removeItem = (id: string) => {
        if (!confirm("삭제하시겠습니까?")) return;
        const updated = items.filter(i => i.id !== id);
        saveItems(updated);
        setItems(updated);
    };

    return (
        <div>
            <h3>냉장고</h3>

            {/* 필터 */}
            <div>
                <strong>보관소:</strong>
                <button onClick={() => setStorageFilter("ALL")} disabled={storageFilter === "ALL"}>전체</button>
                <button onClick={() => setStorageFilter("냉장")} disabled={storageFilter === "냉장"}>냉장</button>
                <button onClick={() => setStorageFilter("냉동")} disabled={storageFilter === "냉동"}>냉동</button>
                <button onClick={() => setStorageFilter("실온")} disabled={storageFilter === "실온"}>실온</button>
            </div>

            {/* 정렬 */}
            <div style={{ marginTop: 6 }}>
                <strong>정렬:</strong>
                <select value={sortKey} onChange={(e) => setSortKey(e.target.value as any)}>
                    <option value="EXPIRE">유효기간↑</option>
                    <option value="NAME">이름↑</option>
                    <option value="STORAGE">저장공간↑</option>
                </select>
            </div>

            {/* 검색(선택) */}
            <div style={{ marginTop: 6 }}>
                <input
                    type="search"
                    placeholder="이름/태그 검색"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* 액션 */}
            <div style={{ marginTop: 8 }}>
                <button onClick={addItem}>식재료 추가</button>
            </div>

            <hr />

            {/* 목록 */}
            {visible.length === 0 ? (
                <div>표시할 항목이 없습니다.</div>
            ) : (
                <ul>
                    {visible.map(i => (
                        <li key={i.id} style={{ marginBottom: 6 }}>
                            <div>
                                <strong>{i.name}</strong> · {i.qty}{i.unit} · {i.storage} · 유효기간: {i.expireDate}
                            </div>
                            <div style={{ marginTop: 4 }}>
                                <button onClick={() => editItem(i.id)}>수정</button>
                                <button onClick={() => removeItem(i.id)}>삭제</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
