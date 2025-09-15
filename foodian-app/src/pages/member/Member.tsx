import {useState} from "react";

/**
 * 멤버 정보 타입
 */
type Member = {
    id: string;
    name: string;
    email?: string;
};

export const Members = () => {
    // 임시 멤버 목록 (실제 서비스에선 서버에서 fetch)
    const [members, _] = useState<Member[]>([
        {id: "1", name: "홍길동", email: "hong@example.com"},
        {id: "2", name: "김철수", email: "chulsoo@example.com"},
    ]);

    // 초대 링크 (실제로는 서버에서 발급)
    const inviteLink = "https://foodian.app/invite/abcd1234";

    /**
     * 초대 링크를 클립보드에 복사
     */
    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(inviteLink);
            alert("초대 링크가 복사되었습니다!");
        } catch (err) {
            console.error(err);
            alert("복사에 실패했습니다. 브라우저 권한을 확인하세요.");
        }
    };

    /**
     * 이메일 앱을 통해 초대 메일 발송
     */
    const sendInviteEmail = () => {
        const subject = encodeURIComponent("푸디언 냉장고 멤버 초대");
        const body = encodeURIComponent(`푸디언 냉장고에 초대합니다.\n\n아래 링크를 눌러 참여하세요:\n${inviteLink}`);
        // 사용자의 기본 메일 앱 열기
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    };

    return (
        <div>
            <h3>구성원</h3>

            {/* 멤버 목록 */}
            <section>
                <h4>멤버 목록</h4>
                {members.length === 0 ? (
                    <p>등록된 멤버가 없습니다.</p>
                ) : (
                    <ul>
                        {members.map((m) => (
                            <li key={m.id}>
                                {m.name}
                                {m.email && ` (${m.email})`}
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <hr/>

            {/* 초대 링크 보내기 */}
            <section>
                <h4>초대 링크 보내기</h4>
                <p>아래 링크를 복사하거나 이메일로 전송할 수 있습니다.</p>
                <div>
                    <code>{inviteLink}</code>
                </div>
                <div style={{marginTop: 8}}>
                    <button onClick={copyLink}>링크 복사</button>
                    <button onClick={sendInviteEmail}>이메일로 보내기</button>
                </div>
            </section>
        </div>
    );
};