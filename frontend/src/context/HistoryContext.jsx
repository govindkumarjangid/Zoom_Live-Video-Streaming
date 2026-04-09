import React from "react";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";

const HistoryContext = React.createContext();

export const HistoryProvider = ({ children }) => {
    const [history, setHistory] = React.useState([]);


    const toastStyle = {
        style: {
            borderRadius: '10px',
            background: '#120E1A',
            color: '#f1f2f3',
            border: '1px solid #999999',
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
            return data.meetingId;
        } catch (error) {
            toast.error('Failed to add to history', error);
            return null;
        }
    }

    const updateHistoryDuration = async (meetingId, duration) => {
        try {
            await axiosInstance.post('/users/update_activity', {
                token: localStorage.getItem('token'),
                meetingId,
                duration
            });
        } catch (error) {
            toast.error('Failed to update history', error);
        }
    }

    const historyValue = {
        history,
        setHistory,
        getHistory,
        addToHistory,
        updateHistoryDuration
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