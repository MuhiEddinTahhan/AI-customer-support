import { useContext, createContext, useState, useEffect, Children } from "react";
import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider, updateCurrentUser } from "firebase/auth";
import {auth} from "../firebase"

const authContext = createContext()

export const AuthContextProvider = ({children}) => {
    
    const [user, setUser] = useState(null)

    const googleSignIn = () => {
        const provider= new GoogleAuthProvider()
        signInWithPopup(auth, provider)
    }

    const logOut = () => {
        signOut(auth)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
        })
        return () => unsubscribe()
    }, [user])
    
    return (<authContext.Provider value={{user, googleSignIn, logOut}}>{children}</authContext.Provider>)
}

export const UserAuth = () => {
    return useContext(authContext)
}