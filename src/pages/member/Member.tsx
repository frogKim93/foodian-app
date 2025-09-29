import {useEffect, useState} from "react";
import {useUser} from "../../contexts/UserContext.tsx";
import "./member.css";

type Member = {
    id: string;
    name: string;
    email: string;
    thumbnailUrl: string;
};

export const Members = () => {
    const {user} = useUser();

    useEffect(() => {
        console.log(user);
    }, []);

    const [members, _] = useState<Member[]>([]);
    const inviteLink = "https://foodian.app/invite/abcd1234";

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(inviteLink);
            alert("초대 링크가 복사되었습니다!");
        } catch (err) {
            console.error(err);
            alert("복사에 실패했습니다. 브라우저 권한을 확인하세요.");
        }
    };

    return (
        <div className="members-container">
            <h3>구성원</h3>

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

            <section>
                <h4>초대 링크 보내기</h4>
                <p>아래 링크를 복사하여 공유할 수 있습니다.</p>
                <div>
                    <code>{inviteLink}</code>
                </div>
                <div style={{marginTop: 8}}>
                    <button onClick={copyLink}>링크 복사</button>
                </div>
            </section>
        </div>
    );
};