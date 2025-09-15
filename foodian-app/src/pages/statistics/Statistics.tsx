import React, {useEffect, useState} from "react";

/** ---------------- Types ---------------- */
type StorageType = "전체" | "냉장" | "냉동" | "실온";

type TimelinePoint = {
    date: string; // YYYY-MM-DD (KST 기준)
    consumed: number;
    discarded: number;
};

type Summary = {
    added: number;
    consumed: number;
    discarded: number;
    discardRate: number; // 0~1
};

type Conversion = {
    alertsCount: number; // 알림 건수(아이템 수 기준)
    alertedQty: number; // 알림 대상 수량 합계 A
    consumedInTimeQty: number; // 기한 내 소비 수량 합계 B
    conversion: number; // B/A (0~1)
    savedEstimate: number; // 알림 ON으로 절약된 폐기 추정 개수
};

/** ---------------- Helpers ---------------- */
const fmtPercent = (v: number) => `${Math.round(v * 100)}%`;
const fmtInt = (n: number) => n.toLocaleString("ko-KR");

// 간단 이동평균(선택)
const movingAvg = (arr: number[], window = 7) =>
    arr.map((_, i) => {
        const s = Math.max(0, i - window + 1);
        const slice = arr.slice(s, i + 1);
        const sum = slice.reduce((a, b) => a + b, 0);
        return sum / slice.length;
    });

// 범위를 0~1로 정규화
const normalize = (value: number, min: number, max: number) =>
    max === min ? 0 : (value - min) / (max - min);

/** ---------------- Demo Fetchers (replace with API) ---------------- */
async function demoFetchSummary(): Promise<Summary> {
    return {added: 50, consumed: 35, discarded: 5, discardRate: 5 / (35 + 5)};
}

async function demoFetchTimeline(): Promise<TimelinePoint[]> {
    // 최근 11일 더미 데이터
    const base = new Date();
    const days = 11;
    const fmt = (d: Date) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
            d.getDate()
        ).padStart(2, "0")}`;
    return Array.from({length: days}).map((_, i) => {
        const d = new Date(base);
        d.setDate(d.getDate() - (days - 1 - i));
        const consumed = Math.floor(4 + Math.random() * 5); // 4~8
        const discarded = Math.floor(Math.random() * 3); // 0~2
        return {date: fmt(d), consumed, discarded};
    });
}

async function demoFetchConversion(): Promise<Conversion> {
    const alertedQty = 120;
    const consumedInTimeQty = 96;
    const conversion = consumedInTimeQty / alertedQty;
    const savedEstimate = 8; // 예시 값 (사전-사후 비교 등으로 산출)
    return {
        alertsCount: 80,
        alertedQty,
        consumedInTimeQty,
        conversion,
        savedEstimate,
    };
}

/** ---------------- Small UI atoms ---------------- */
const KPI: React.FC<{ label: string; value: string; sub?: string }> = ({label, value, sub}) => (
    <div className="kpi">
        <div className="kpi-label">{label}</div>
        <div className="kpi-value">{value}</div>
        {sub ? <div className="kpi-sub">{sub}</div> : null}
    </div>
);

/** 막대/선 SVG 차트 */
const BarLineChart: React.FC<{
    data: TimelinePoint[];
    height?: number;
}> = ({data, height = 220}) => {
    const padding = {t: 16, r: 12, b: 28, l: 28};
    const width = 640; // 컨테이너 폭 100%에서 viewBox로 스케일
    const innerW = width - padding.l - padding.r;
    const innerH = height - padding.t - padding.b;

    const maxY = Math.max(1, ...data.map((d) => Math.max(d.consumed, d.discarded)));
    const barGroupWidth = innerW / data.length;
    const barWidth = Math.max(6, (barGroupWidth * 0.7) / 2); // 소비/폐기 2개 막대

    const consumedMA = movingAvg(data.map((d) => d.consumed), 5);

    const path = consumedMA
        .map((v, i) => {
            const x = padding.l + barGroupWidth * i + barGroupWidth / 2;
            const y = padding.t + innerH * (1 - normalize(v, 0, maxY));
            return `${i === 0 ? "M" : "L"}${x},${y}`;
        })
        .join(" ");

    return (
        <svg viewBox={`0 0 ${width} ${height}`} style={{width: "100%", height}} role="img" aria-label="기간별 소비/폐기 차트">
            {/* 축 라인 */}
            <line x1={padding.l} y1={padding.t + innerH} x2={width - padding.r} y2={padding.t + innerH}
                  stroke="var(--line)"/>

            {/* 막대들 */}
            {data.map((d, i) => {
                const x0 = padding.l + barGroupWidth * i + barGroupWidth / 2;
                const hCons = innerH * (d.consumed / maxY);
                const hDisc = innerH * (d.discarded / maxY);
                const yCons = padding.t + innerH - hCons;
                const yDisc = padding.t + innerH - hDisc;
                return (
                    <g key={d.date}>
                        {/* 소비(파란 계열) */}
                        <rect x={x0 - barWidth - 2} y={yCons} width={barWidth} height={hCons} rx={4} fill="currentColor"
                              opacity={0.9}/>
                        {/* 폐기(회색 계열) */}
                        <rect x={x0 + 2} y={yDisc} width={barWidth} height={hDisc} rx={4} fill="currentColor"
                              opacity={0.5}/>
                        {/* x축 라벨 */}
                        <text x={x0} y={padding.t + innerH + 18} textAnchor="middle" fontSize={10} fill="var(--muted)">
                            {d.date.slice(5)}
                        </text>
                    </g>
                );
            })}

            {/* 이동평균 선(소비) */}
            <path d={path} fill="none" stroke="currentColor" strokeWidth={2} opacity={0.9}/>

            {/* 범례 (consumed=짙은, discarded=옅은) */}
            <g transform={`translate(${width - 160}, ${padding.t})`}>
                <rect width="10" height="10" rx="2" fill="currentColor" opacity={0.9}/>
                <text x="16" y="9" fontSize="11">소비</text>
                <rect x="64" width="10" height="10" rx="2" fill="currentColor" opacity={0.5}/>
                <text x="80" y="9" fontSize="11">폐기</text>
            </g>
        </svg>
    );
};

export const Statistics = () => {
    const [storage, setStorage] = useState<StorageType>("전체");
    const [summary, setSummary] = useState<Summary | null>(null);
    const [timeline, setTimeline] = useState<TimelinePoint[]>([]);
    const [conv, setConv] = useState<Conversion | null>(null);

    // Demo fetch (실서비스: useEffect에서 API 호출로 대체)
    useEffect(() => {
        (async () => {
            const [s, t, c] = await Promise.all([
                demoFetchSummary(),
                demoFetchTimeline(),
                demoFetchConversion(),
            ]);
            setSummary(s);
            setTimeline(t);
            setConv(c);
        })();
    }, []);

    const discardRatePct = summary ? fmtPercent(summary.discardRate) : "-";

    return (
        <main className="card" aria-labelledby="stats-title">
            <header className="header">
                <div className="logo" id="stats-title" aria-label="푸디언 통계">
                    <span className="logo-badge">F</span>
                    <span>통계</span>
                </div>
                <p className="subtitle">기간별 소비/폐기 흐름과 알림 효과를 확인하세요</p>
            </header>

            {/* 필터 영역 (간단 MVP) */}
            <section className="field">
                <div className="row" style={{gap: 8, justifyContent: "flex-start"}}>
                    <button className="btn">이번 주</button>
                    <button className="btn">지난 주</button>
                    <button className="btn">이번 달</button>
                    <button className="btn">지난 달</button>
                    <button className="btn">30일</button>
                    <div className="input" style={{width: 160}}>
                        <select aria-label="저장소 필터" value={storage}
                                onChange={(e) => setStorage(e.target.value as StorageType)}
                                style={{width: "100%", background: "transparent", color: "inherit", border: 0}}>
                            <option>전체</option>
                            <option>냉장</option>
                            <option>냉동</option>
                            <option>실온</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* 요약 카드 */}
            <section className="field">
                <div className="row" style={{gap: 12, flexWrap: "wrap", justifyContent: "flex-start"}}>
                    <KPI label="총 추가" value={summary ? fmtInt(summary.added) : "-"}/>
                    <KPI label="소비" value={summary ? fmtInt(summary.consumed) : "-"}/>
                    <KPI label="폐기" value={summary ? fmtInt(summary.discarded) : "-"} sub={`폐기율 ${discardRatePct}`}/>
                </div>
            </section>

            {/* 타임라인 차트 */}
            <section className="field" aria-labelledby="timeline-title">
                <h2 id="timeline-title" style={{margin: 0, fontSize: 16}}>기간별 소비/폐기</h2>
                <div className="chart-surface">
                    {timeline.length ? <BarLineChart data={timeline}/> :
                        <div className="input" style={{justifyContent: "center"}}>데이터 없음</div>}
                </div>
            </section>

            <div className="divider"/>

            {/* 전환율 & 절약 추정 */}
            <section className="field" aria-labelledby="conv-title">
                <h2 id="conv-title" style={{margin: 0, fontSize: 16}}>임박 → 소비 전환</h2>
                <div className="row" style={{gap: 12, flexWrap: "wrap", justifyContent: "flex-start"}}>
                    <KPI label="전환율" value={conv ? fmtPercent(conv.conversion) : "-"}
                         sub={conv ? `알림 대상 ${fmtInt(conv.alertedQty)}개 중 ${fmtInt(conv.consumedInTimeQty)}개` : undefined}/>
                    <KPI label="절약 추정" value={conv ? `${fmtInt(conv.savedEstimate)}개` : "-"}
                         sub={conv ? `알림 효과로 줄어든 폐기 추정` : undefined}/>
                </div>
                <div className="row" style={{justifyContent: "flex-end"}}>
                    <a className="btn" href="/fridge?filter=expiring">임박만 보기 →</a>
                </div>
            </section>
        </main>
    );
};