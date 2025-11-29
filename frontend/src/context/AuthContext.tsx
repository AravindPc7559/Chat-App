import { createContext, useContext, useState, ReactNode } from "react";
import { User, AuthContextType } from "../types";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within AuthContextProvider");
    }
    return context;
};

interface AuthContextProviderProps {
    children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
    const [authUser, setAuthUser] = useState<User | null>(
        JSON.parse(localStorage.getItem("chat-user") || "null")
    );

    return (
        <AuthContext.Provider value={{ authUser, setAuthUser, loading: false }}>
            {children}
        </AuthContext.Provider>
    );
};

