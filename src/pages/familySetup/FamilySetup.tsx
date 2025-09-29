import {useEffect, useState} from "react";
import axios, {HttpStatusCode} from "axios";
import {useNavigate} from "react-router-dom";
import "./familySetup.css";
import {Path} from "../../routes/Paths.ts";
import {useUser} from "../../contexts/UserContext.tsx";
import {CREATE_FAMILY, GET_FAMILY, JOIN_FAMILY} from "../../api/Api.ts";
import {MemberRole} from "../../constants/MemberRole.ts";

export const FamilySetup = () => {
    const navigate = useNavigate();
    const [joinCode, setJoinCode] = useState("");
    const {user, setUser} = useUser();

    useEffect(() => {
        if (user) {
            checkFamilySetup(user.id);
        }
    }, [user]);

    const checkFamilySetup = (userId: number) => {
        axios.get(GET_FAMILY(userId)).then(response => {
            setUser({
                ...user!,
                familyId: response.data.family.id,
                role: response.data.role
            });

            navigate(Path.ONBOARDING);
        }).catch(error => {
            if (error.status === HttpStatusCode.BadRequest) {
                alert("로그인 정보가 만료되었습니다. 다시 로그인해주세요.");
                navigate(Path.LOGIN);
            } else if (error.status === HttpStatusCode.NotFound) {
                /*가입된 가족이 없는 경우*/
            } else {
                console.log(error);
            }
        });
    }

    const createFamily = () => {
        axios.post(CREATE_FAMILY(user!.id)).then(response => {
            setUser({
                ...user!,
                role: MemberRole.LEADER,
                familyId: response.data.id
            });

            navigate(Path.ONBOARDING);
        }).catch(error => {
            if (error.status === HttpStatusCode.BadRequest) {
                alert("로그인 정보가 만료되었습니다. 다시 로그인해주세요.");
                navigate(Path.LOGIN);
            } else if (error.status === HttpStatusCode.Conflict) {
                alert("이미 가입된 가족이 있습니다. 홈으로 이동합니다.");

                setUser({
                    ...user!,
                    role: error.response.data.member.id === user!.id ? MemberRole.LEADER : MemberRole.MEMBER,
                    familyId: error.response.data.id
                });

                navigate(Path.ONBOARDING);
            } else {
                console.log(error);
            }
        });
    }

    const joinFamily = () => {
        if (!joinCode.trim()) {
            alert("가족 코드를 확인해주세요.");
            return;
        }

        axios.post(JOIN_FAMILY(user!.id, joinCode)).then(response => {
            setUser({
                ...user!,
                role: MemberRole.MEMBER,
                familyId: response.data.family.id
            });

            navigate(Path.ONBOARDING);
        }).catch(error => {
            if (error.status === HttpStatusCode.BadRequest) {
                alert("유효하지 않은 가족코드입니다.");
            } else if (error.status === HttpStatusCode.Unauthorized) {
                alert("로그인 정보가 만료되었습니다. 다시 로그인해주세요.");
                navigate(Path.LOGIN);
            } else if (error.status === HttpStatusCode.Conflict) {
                alert("이미 가입된 가족이 있습니다. 홈으로 이동합니다.");
                navigate(Path.ONBOARDING);
            }
        });
    }

    return (
        <main className="family-setup">
            <h2>가족 설정</h2>
            <p className="subtitle">가족 코드를 입력하거나 새 가족을 만들어주세요.</p>
            <section>
                <h3>1. 가족 코드로 참여</h3>
                <form>
                    <input
                        type="text"
                        placeholder="가족 코드 입력"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                    />
                    <button onClick={() => joinFamily()} type="button" className="btn btn-primary">참여하기</button>
                </form>
            </section>
            <hr/>
            <section>
                <h3>2. 새로운 가족 만들기</h3>
                <form>
                    <button onClick={() => createFamily()} type="button" className="btn btn-secondary">가족 생성</button>
                </form>
            </section>
        </main>
    );
};
