import React, { useContext } from "react";

const AuthContext = React.createContext();

export const AuthContextProvider = ({ children }) => {

    const user = null;
    const [formState, setFormState] = React.useState('login');


    const toastStyle = {
        style: {
            borderRadius: '10px',
            background: '#120E1A',
            color: '#f1f2f3',
            border: '1px solid #999999',
        },
    }

    const authValue = {
        user,
        formState,
        setFormState,
        toastStyle

    };

    return (
        <AuthContext.Provider value={authValue}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
}
