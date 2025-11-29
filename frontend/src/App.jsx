import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import Profile from "./pages/profile/Profile";
import Plans from "./pages/plans/Plans";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";

function AppContent() {
    const { authUser } = useAuthContext();
    const location = useLocation();
    const isPlansPage = location.pathname === '/plans';
    
    // Update body overflow based on route
    React.useEffect(() => {
        if (isPlansPage) {
            document.body.style.overflow = 'auto';
            document.documentElement.style.overflow = 'auto';
        } else {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, [isPlansPage]);
    
    return (
        <div className={`w-full ${isPlansPage ? 'min-h-screen' : 'h-screen overflow-hidden'}`}>
            <Routes>
                <Route path='/' element={authUser ? <Home /> : <Navigate to={"/login"} />} />
                <Route path='/login' element={authUser ? <Navigate to='/' /> : <Login />} />
                <Route path='/signup' element={authUser ? <Navigate to='/' /> : <SignUp />} />
                <Route path='/profile' element={authUser ? <Profile /> : <Navigate to='/login' />} />
                <Route path='/plans' element={<Plans />} />
            </Routes>
            <Toaster 
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#fff',
                        color: '#1f2937',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    },
                }}
            />
        </div>
    );
}

function App() {
    return <AppContent />;
}

export default App;
