import {Path} from "../../routes/Paths.ts";
import {useNavigate} from "react-router-dom";
import type {ChangeEvent, FormEvent} from "react"
import {useState} from "react";
import type {LoginDto} from "./dto/login.dto.ts";
import {InitialLoginDto} from "./dto/login.dto.ts";
import axios, {HttpStatusCode} from "axios";
import {LOGIN_API} from "../../api/Api.ts";
import {useUser} from "../../contexts/UserContext.tsx";

export const Login = () => {
    const navigate = useNavigate();
    const [loginDto, setLoginDto] = useState<LoginDto>(InitialLoginDto());
    const [errorMessage, setErrorMessage] = useState<string>("");
    const {setUser} = useUser();

    const loginHandler = () => {
        window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=04b31b8e55e1625e2f2bc133d1a18115&redirect_uri=http://localhost:5173/kakao-auth&response_type=code`;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setLoginDto(prev => ({...prev, [name]: value}));
    };

    const login = (event: FormEvent) => {
        event.preventDefault();
        setErrorMessage("");

        axios.post(LOGIN_API, loginDto).then(response => {
            setUser(response.data);
            navigate(Path.FAMILY_SETUP);
        }).catch(error => {
            if (error.status === HttpStatusCode.Unauthorized || error.status === HttpStatusCode.BadRequest) {
                setErrorMessage("아이디, 비밀번호를 다시 확인해주세요.");
            } else {
                console.log(error);
                setErrorMessage("서버에 문제가 발생하였습니다. \n잠시 후 다시 시도해주세요.");
            }
        });
    };

    return (
        <>
            <main className="card" aria-labelledby="title">
                <header className="header">
                    <div className="logo" id="title" aria-label="푸디언 로그인">
                        <span className="logo-badge">F</span>
                        <span>푸디언</span>
                    </div>
                    <p className="subtitle">냉장고 속 식재료, 똑똑하게 관리하기</p>
                </header>

                <form>
                    <div className="field">
                        <label htmlFor="email">이메일</label>
                        <div className="input">
                            <img src="/image/icon/email.svg"/>
                            <input id="email" name="username" type="email" inputMode="email" autoComplete="email"
                                   placeholder="you@example.com" required
                                   onChange={handleChange}/>
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="password">비밀번호</label>
                        <div className="input">
                            <img src="/image/icon/password.svg"/>
                            <input id="password" name="password" type="password" autoComplete="current-password"
                                   placeholder="비밀번호" minLength={6} required
                                   onChange={handleChange}/>
                        </div>
                    </div>

                    <span className="error-msg text-12 text-bolder">{errorMessage}</span>

                    <div className="actions">
                        <button onClick={login} className="btn btn-primary">로그인</button>
                        <button onClick={() => loginHandler()} className="btn btn-kakao" aria-label="카카오로 로그인">
                            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                                <path
                                    d="M12 3C6.477 3 2 6.298 2 10.372c0 2.455 1.665 4.608 4.17 5.88-.147.54-.528 1.935-.606 2.239-.095.38.14.373.296.27.122-.08 1.934-1.3 2.717-1.824.481.07.976.108 1.49.108 5.523 0 10-3.298 10-7.373C20.067 6.298 17.523 3 12 3z"
                                    fill="#000"/>
                            </svg>
                            카카오로 로그인
                        </button>
                    </div>
                </form>

                <div className="divider" role="separator" aria-label="또는">또는</div>

                <nav className="links" aria-label="보조 링크">
                    <a href={Path.SIGNUP} aria-label="회원가입">회원가입</a>
                    <a href="#support" aria-label="도움이 필요하신가요?">도움말</a>
                </nav>
            </main>

            <footer>© <span id="year"></span> 푸디언 • All rights reserved.</footer>
        </>
    )
}