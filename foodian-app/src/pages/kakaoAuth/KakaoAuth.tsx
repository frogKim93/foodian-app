import {useEffect} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import axios from "axios";
import {Path} from "../../routes/Paths.ts";

export const KakaoAuth = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
            const code = searchParams.get("code");

            axios.get(`http://localhost:8080/login?code=${code}`).then(response => {
                console.log(response);
                navigate(Path.ONBOARDING, {state: {user: response.data}});
            }).catch(e => {
                console.log(e);
                navigate(Path.LOGIN);
            });
        }, []
    )
    ;

    return (
        <div>
            카카오 인증 페이지
        </div>
    )
}