import type {ReactNode} from "react";
import {createContext, useContext, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {Path} from "../routes/Paths.ts";
import {MemberRole} from "../constants/MemberRole.ts";

export interface User {
    id: number;
    username: string;
    name: string;
    thumbnailUrl: string;
    familyId: number;
    role: MemberRole;
}

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({children}: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            localStorage.setItem("foodian-user", JSON.stringify(user));
        } else {
            const lastLoginUser = localStorage.getItem("foodian-user");

            if (lastLoginUser) {
                setUser(JSON.parse(lastLoginUser));
                navigate(Path.FAMILY_SETUP);
            } else if (![Path.LOGIN, Path.SIGNUP, Path.DEFAULT].includes(location.pathname)) {
                navigate(Path.LOGIN);
            }
        }
    }, [user]);

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);

    if (!context) throw new Error("useUser must be used within UserProvider");

    return context;
};