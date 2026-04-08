import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const WithAuth = (Component) => {

    const AuthComponent = (props) => {
        const navigate = useNavigate();
        const token = localStorage.getItem('token');

        useEffect(() => {
            if (!token) navigate('/authentication');
        }, [token, navigate]);

        if (!token) return null;

        return <Component {...props} />;
    }

    return AuthComponent;
}

export default WithAuth;