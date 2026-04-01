import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface AppDataContextType {
    appLoading: boolean;
    setAppLoading: (loading: boolean) => void;
    user: any; // replace with actual user type
    setUser: (user: any) => void;
    facilities: any[]; // replace with actual facility type
    setFacilities: React.Dispatch<React.SetStateAction<any>>;
    isAuthenticated: boolean;
    setIsAuthenticated: (auth: boolean) => void;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    authLoading: boolean;
    error: string | null;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
}


const AppDataContext = createContext<AppDataContextType | null>(null)

const AppDataProvider = ({ children }: { children: React.ReactNode }) => {

    // Initialize appLoading to true ONLY if we have a token that we need to verify with the server
    const [appLoading, setAppLoading] = useState(!!localStorage.getItem("token"))
    const [user, setUser] = useState(null)
    const [facilities, setFacilities] = useState([])
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [authLoading, setAuthLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const navigate = useNavigate()

    //login
    async function login(username: string, password: string) {
        setAuthLoading(true)
        try {
            // 1. Get the token from login endpoint
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/Auth/login`, { email: username, password })
            const token = response.data
            localStorage.setItem("token", token)

            // 2. Fetch the user's profile object using the new token
            const meResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/Auth/login`, {
                headers: { Authorization: `Bearer ${token}` },
            })

            console.log("Fetched user after login", meResponse.data)
            setUser(meResponse.data)
            setIsAuthenticated(true)

            navigate('/') // redirect to dashboard after successful login
        } catch (error) {
            console.error("Login failed", error)
            setIsAuthenticated(false)
            setUser(null)
            localStorage.removeItem("token")
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || error.message)
            } else if (error instanceof Error) {
                setError(error.message)
            } else {
                setError(String(error))
            }
        } finally {
            setAuthLoading(false)
        }
    }

    // Restore session on mount using stored token
    async function fetchCurrentUser() {
        const token = localStorage.getItem("token")
        if (!token) return

        setAppLoading(true)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/Auth/login`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            console.log("Current user", response.data)
            setUser(response.data)
            setIsAuthenticated(true)
        } catch (error: any) {
            console.error("Failed to fetch current user", error)
            // Token is invalid or expired — clear stored credentials
            localStorage.removeItem("token")
            setUser(null)
            setIsAuthenticated(false)
        } finally {
            setAppLoading(false)
        }
    }

    const logout = () => {
        localStorage.removeItem("token")
        setUser(null)
        setIsAuthenticated(false)
        navigate('/login')
    }

    useEffect(() => {
        fetchCurrentUser()
    }, [])

    return (
        <AppDataContext.Provider value={{ appLoading, setAppLoading, user, setUser, facilities, setFacilities, isAuthenticated, setIsAuthenticated, login, logout, authLoading, error, setError }}>
            {children}
        </AppDataContext.Provider>
    )
}

const useAppData = () => {
    const context = React.useContext(AppDataContext)
    if (!context) {
        throw new Error("useAppData must be used within an AppDataProvider")
    }
    return context;
}

export { AppDataContext, AppDataProvider, useAppData }