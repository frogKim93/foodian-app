export const Signup = () => {
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


                <form action="#" method="post" noValidate>
                    <div className="field">
                        <label htmlFor="name">이름</label>
                        <div className="input">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path
                                    d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"
                                    stroke="currentColor" stroke-width="1.2"/>
                            </svg>
                            <input id="name" name="name" type="text" autoComplete="name" placeholder="홍길동" required/>
                        </div>
                    </div>


                    <div className="field">
                        <label htmlFor="email">이메일</label>
                        <div className="input">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path
                                    d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm0 0 8 6 8-6"
                                    stroke="currentColor" stroke-width="1.6" stroke-linecap="round"
                                    stroke-linejoin="round"/>
                            </svg>
                            <input id="email" name="email" type="email" inputMode="email" autoComplete="email"
                                   placeholder="you@example.com" required/>
                        </div>
                    </div>


                    <div className="field">
                        <label htmlFor="password">비밀번호</label>
                        <div className="input">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M7 10V8a5 5 0 0 1 10 0v2" stroke="currentColor" stroke-width="1.6"
                                      stroke-linecap="round"/>
                                <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor"
                                      stroke-width="1.6"/>
                            </svg>
                            <input id="password" name="password" type="password" autoComplete="new-password"
                                   placeholder="영문/숫자 8자 이상" minLength={8} required/>
                        </div>
                    </div>


                    <div className="field">
                        <label htmlFor="password2">비밀번호 확인</label>
                        <div className="input">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M7 10V8a5 5 0 0 1 10 0v2" stroke="currentColor" stroke-width="1.6"
                                      stroke-linecap="round"/>
                                <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor"
                                      stroke-width="1.6"/>
                            </svg>
                            <input id="password2" name="password2" type="password" autoComplete="new-password"
                                   placeholder="비밀번호 재입력" minLength={8} required/>
                        </div>
                    </div>


                    <div className="row" aria-label="약관 동의">
                        <label className="checkbox">
                            <input type="checkbox" id="agree" name="agree" required/>이용약관 및 개인정보처리방침에 동의합니다
                        </label>
                    </div>


                    <div className="actions">
                        <button className="btn btn-primary" type="submit">회원가입</button>
                        <a className="btn" href="/" aria-label="로그인으로 돌아가기">로그인으로 돌아가기</a>
                    </div>
                </form>


                <div className="divider" role="separator" aria-label="또는">또는</div>


                <nav className="links" aria-label="보조 링크">
                    <a href="#login" aria-label="이미 계정이 있으신가요? 로그인">이미 계정이 있으신가요? 로그인</a>
                    <a href="#support" aria-label="도움말">도움말</a>
                </nav>
            </main>


            <footer>© <span id="year"></span> 푸디언 • All rights reserved.</footer>
        </>
    )
}