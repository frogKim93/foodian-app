import {Route, Routes, useLocation} from "react-router-dom";
import {Path} from "./routes/Paths.ts";
import {KakaoAuth} from "./pages/kakaoAuth/KakaoAuth.tsx";
import {Login} from "./pages/login/Login.tsx";
import {MenuBar} from "./component/menuBar/MeneBar.tsx";
import {Fridge} from "./pages/fridge/Fridge.tsx";
import {Setting} from "./pages/setting/Setting.tsx";
import {Members} from "./pages/member/Member.tsx";
import {Signup} from "./pages/signup/Signup.tsx";
import {Onboarding} from "./pages/onboarding/Onboarding.tsx";
import {Home} from "./pages/home/Home.tsx";
import {Statistics} from "./pages/statistics/Statistics.tsx";

function App() {
    const noMenubarPages = [Path.LOGIN, Path.SIGNUP, Path.ONBOARDING, Path.DEFAULT];
    const location = useLocation();

    return (
        <>
            <Routes>
                <Route path={Path.HOME} element={<Home/>}/>
                <Route path={Path.KAKAO_AUTH_REDIRECT} element={<KakaoAuth/>}/>
                <Route path={Path.LOGIN} element={<Login/>}/>
                <Route path={Path.SIGNUP} element={<Signup/>}/>
                <Route path={Path.ONBOARDING} element={<Onboarding/>}/>
                <Route path={Path.MEMBER} element={<Members/>}/>
                <Route path={Path.SETTING} element={<Setting/>}/>
                <Route path={Path.FRIDGE} element={<Fridge/>}/>
                <Route path={Path.STATISTICS} element={<Statistics/>}/>
                <Route path="*" element={<Login/>}/>
            </Routes>
            {!noMenubarPages.includes(location.pathname) && <MenuBar/>}
        </>
    )
}

export default App
