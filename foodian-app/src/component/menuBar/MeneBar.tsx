import {NavLink} from "react-router-dom";
import {Path} from "../../routes/Paths.ts";

export const MenuBar = () => {
    const navStyle: React.CSSProperties = {
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "60px",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        borderTop: "1px solid #ddd",
        background: "#fff",
        zIndex: 10,
    };

    const linkStyle: React.CSSProperties = {
        textDecoration: "none",
        color: "#333",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontSize: "14px",
    };

    const activeStyle: React.CSSProperties = {
        color: "#0077ff",
        fontWeight: "bold",
    };

    return (
        <nav style={navStyle}>
            <NavLink
                to={Path.MEMBER}
                style={({isActive}) => (isActive ? {...linkStyle, ...activeStyle} : linkStyle)}
            >
                👥
                <span>구성원</span>
            </NavLink>

            <NavLink
                to={Path.FRIDGE}
                style={({isActive}) => (isActive ? {...linkStyle, ...activeStyle} : linkStyle)}
            >
                🧊
                <span>냉장고</span>
            </NavLink>

            <NavLink
                to={Path.HOME}
                end
                style={({isActive}) => (isActive ? {...linkStyle, ...activeStyle} : linkStyle)}
            >
                🏠
                <span>홈</span>
            </NavLink>

            <NavLink
                to={Path.STATISTICS}
                style={({isActive}) => (isActive ? {...linkStyle, ...activeStyle} : linkStyle)}
            >
                📊
                <span>통계</span>
            </NavLink>


            <NavLink
            to={Path.SETTING}
            style={({isActive}) => (isActive ? {...linkStyle, ...activeStyle} : linkStyle)}
        >
            ⚙️
            <span>설정</span>
        </NavLink>
        </nav>
    );
};
