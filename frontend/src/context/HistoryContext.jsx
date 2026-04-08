import React from "react";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";

const HistoryContext = React.createContext();

export const HistoryProvider = ({ children }) => {
    const [history, setHistory] = React.useState([]);

    const toastStyle = {
        style: {
            borderRadius: '10px',
            background: '#0F0C17',
            color: '#f1f2f3',
            border: '1px solid #f27e20',
        },
    }

    const getHistory = async () => {
        try {
            const { data } = await axiosInstance.get('/users/get_all_activity', {
                params: {
                    token: localStorage.getItem('token')
                }
            });
            setHistory(data.meetings);
            toast.success(data.message, toastStyle);
        } catch (error) {
            toast.error(error.response.data.message || 'Failed to fetch history', toastStyle);
        }
    }

    const addToHistory = async (meeting_code) => {
        try {
            const { data } = await axiosInstance.post('/users/add_to_activity', {
                token: localStorage.getItem('token'),
                meeting_code
            });
            console.log(data.message)
            toast.success(data.message, toastStyle);
        } catch (error) {
            toast.error(error.response.data.message || 'Failed to add to history', toastStyle);
        }
    }


    const historyValue = {
        history,
        setHistory,
        getHistory,
        addToHistory
    };

    return (
        <HistoryContext.Provider value={historyValue}>
            {children}
        </HistoryContext.Provider>
    );
}

export const useHistory = () => {
    return React.useContext(HistoryContext);
}