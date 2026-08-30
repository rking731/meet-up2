import {io} from 'socket.io-client';

const getSocketUrl = () => {
    if (import.meta.env.VITE_BASE_URL) {
        return import.meta.env.VITE_BASE_URL;
    }

    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;

        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:3000';
        }

        return `http://${hostname}:3000`;
    }

    return 'http://localhost:3000';
};

const SOCKET_URL = getSocketUrl();

export const socket = io(SOCKET_URL, {
    autoConnect: false,
    withCredentials: true,
    transports: ['websocket', 'polling'],
})