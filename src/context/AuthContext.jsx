import { createContext, useState } from "react";

export const authContext = createContext()

export default function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('userToken')
    )

    function saveToken(token) {
        localStorage.setItem("userToken", token)
        setToken(token)
    }

    function removeToken() {
        localStorage.removeItem("userToken");
        setToken(null)
    }

    return (
        <authContext.Provider value={{ token, saveToken,removeToken }}>
            {children}
        </authContext.Provider>
    )
}

