import type {ChangeEvent, KeyboardEvent} from "react";
import {useRef, useState} from "react";
import type {SignupDto} from "./dto/signup.dto.ts";
import {InitialSignupDto} from "./dto/signup.dto.ts";
import axios, {HttpStatusCode} from "axios";
import {SIGNUP_API} from "../../api/Api.ts";
import {useNavigate} from "react-router-dom";
import {Path} from "../../routes/Paths.ts";

export const Signup = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<SignupDto>(InitialSignupDto());
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [userErrorMessage, setUserErrorMessage] = useState<SignupDto>(InitialSignupDto())
    const [agree, setAgree] = useState<boolean>(false);
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        if (name === "confirmPassword") {
            setConfirmPassword(value);
        } else {
            setUser((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();

            const element = e.target as HTMLInputElement;
            const currentIndex = inputRefs.current.findIndex(inputRef => inputRef?.name === element.name);
            const nextIndex = currentIndex + 1;

            if (nextIndex < inputRefs.current.length) {
                inputRefs.current[nextIndex]?.focus();
            } else {
                inputRefs.current[currentIndex]?.blur();
                signup();
            }
        }
    }

    const signup = () => {
        if (!agree) {
            alert("이용약관 및 개인정보처리방침에 동의해주세요.");
            return;
        }

        setUserErrorMessage(InitialSignupDto());

        if (user.password !== confirmPassword) {
            alert("비밀번호와 비밀번호 확인이 일치하지 않습니다. 다시 확인해주세요.");
            return;
        }

        axios.post(SIGNUP_API, user).then(() => {
            alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
            navigate(Path.LOGIN);
        }).catch(error => {
            if (error.status === HttpStatusCode.BadRequest) {
                setUserErrorMessage({
                    ...InitialSignupDto(),
                    ...error.response.data
                });
            } else if (error.status === HttpStatusCode.Conflict) {
                setUserErrorMessage({
                    ...InitialSignupDto(),
                    username: "이미 사용중인 이메일입니다."
                });
            } else {
                console.log(error);
            }
        })
    }

    return (
        <>
            <main className="card" aria-labelledby="title">
                <header className="header">
                    <div className="logo" id="title" aria-label="푸디언 회원가입">
                        <span className="logo-badge">F</span>
                        <span>푸디언</span>
                    </div>
                    <p className="subtitle">시작해볼까요? 간단한 정보만 입력하면 돼요.</p>
                </header>
                <form>
                    <div className="field">
                        <label htmlFor="name">
                            <span>이름</span>
                            {userErrorMessage.name && <span className="error-msg">{userErrorMessage.name}</span>}
                        </label>
                        <div className="input">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path
                                    d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"
                                    stroke="currentColor" strokeWidth="1.2"/>
                            </svg>
                            <input ref={(el) => {inputRefs.current[0] = el;}}
                                   onKeyDown={handleKeyDown}
                                   onChange={handleChange} id="name" name="name" type="text" autoComplete="name"
                                   placeholder="홍길동" required/>
                        </div>
                    </div>
                    <div className="field">
                        <label htmlFor="username">
                            <span>이메일</span>
                            {userErrorMessage.username &&
                                <span className="error-msg">{userErrorMessage.username}</span>}
                        </label>
                        <div className="input">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path
                                    d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm0 0 8 6 8-6"
                                    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
                                    strokeLinejoin="round"/>
                            </svg>
                            <input ref={(el) => {inputRefs.current[1] = el;}}
                                   onKeyDown={handleKeyDown}
                                   onChange={handleChange} id="username" name="username" type="email" inputMode="email"
                                   autoComplete="username"
                                   placeholder="you@example.com" required/>
                        </div>
                    </div>
                    <div className="field">
                        <label htmlFor="password">
                            <span>비밀번호</span>
                            {userErrorMessage.password &&
                                <span className="error-msg">{userErrorMessage.password}</span>}
                        </label>
                        <div className="input">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M7 10V8a5 5 0 0 1 10 0v2" stroke="currentColor" strokeWidth="1.6"
                                      strokeLinecap="round"/>
                                <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor"
                                      strokeWidth="1.6"/>
                            </svg>
                            <input ref={(el) => {inputRefs.current[2] = el;}}
                                   onKeyDown={handleKeyDown}
                                   onChange={handleChange} id="password" name="password" type="password"
                                   autoComplete="new-password"
                                   placeholder="영문/숫자/특수문자 8자 이상" minLength={8} required/>
                        </div>
                    </div>
                    <div className="field">
                        <label htmlFor="confirmPassword">비밀번호 확인</label>
                        <div className="input">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M7 10V8a5 5 0 0 1 10 0v2" stroke="currentColor" strokeWidth="1.6"
                                      strokeLinecap="round"/>
                                <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor"
                                      strokeWidth="1.6"/>
                            </svg>
                            <input ref={(el) => {inputRefs.current[3] = el;}}
                                   onChange={handleChange} id="confirmPassword" name="confirmPassword" type="password"
                                   onKeyDown={handleKeyDown}
                                   autoComplete="new-password"
                                   placeholder="비밀번호 재입력" minLength={8} required/>
                        </div>
                    </div>
                    <div className="row" aria-label="약관 동의">
                        <label className="checkbox">
                            <input checked={agree} onChange={(e) => setAgree(e.target.checked)} type="checkbox"
                                   id="agree" name="agree" required/>이용약관 및 개인정보처리방침에 동의합니다
                        </label>
                    </div>
                    <div className="actions">
                        <a onClick={() => signup()} className="btn btn-primary">회원가입</a>
                        <a className="btn" href="/" aria-label="로그인으로 돌아가기">로그인으로 돌아가기</a>
                    </div>
                </form>
            </main>
            <footer>© <span id="year"></span> 푸디언 • All rights reserved.</footer>
        </>
    )
}