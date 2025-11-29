import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { useAuthContext } from "./AuthContext";
import io, { Socket } from "socket.io-client";
import { SocketContextType } from "../types";

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocketContext = (): SocketContextType => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocketContext must be used within SocketContextProvider");
    }
    return context;
};

interface SocketContextProviderProps {
    children: ReactNode;
}

export const SocketContextProvider = ({ children }: SocketContextProviderProps) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const { authUser } = useAuthContext();

    useEffect(() => {
        if (authUser) {
            const newSocket = io("http://localhost:5001", {
                query: {
                    userId: authUser._id,
                },
            });

            setSocket(newSocket);

            // socket.on() is used to listen to the events. can be used both on client and server side
            newSocket.on("getOnlineUsers", (users: string[]) => {
                setOnlineUsers(users);
            });

            return () => {
                newSocket.close();
            };
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [authUser]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};

