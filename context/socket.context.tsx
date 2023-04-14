import { createContext, useContext, useEffect, useState } from 'react'
import io, { Socket } from 'socket.io-client';
import { SOCKET_URL } from '@/config/default'
import { EVENTS } from '@/config/socketEvents';


interface Context {
    socket: Socket;
    username?: string;
    setUsername: Function;
    roomId?: string;
    rooms: Record<string, { name: string }>;
    messages: Record<
        string,
        { message: string; username: string; time: string }
    >,
    setMessages: Function
}

const socket = io(SOCKET_URL);

const SocketContext = createContext<Context>({
    socket,
    rooms: {},
    setUsername: () => false,
    messages: {},
    setMessages: () => false
})


function SocketsProvider(props: any) {
    const [username, setUsername] = useState()
    const [roomId, setRoomId] = useState('')
    const [rooms, setRooms] = useState({})
    const [messages, setMessages] = useState<Record<string, { message: string; username: string; time: string }>>({});

    socket.on(EVENTS.SERVER.JOINED_ROOM, (value) => {
        setRoomId(value)
        setMessages({})
    })


    useEffect(() => {
        window.onfocus = function () {
            document.title = "Chat app";
        };
        socket.on(EVENTS.SERVER.ROOMS, (values) => {
            setRooms(values)
        })
    }, []);

    useEffect(() => {
        socket.on(EVENTS.SERVER.ROOM_MESSAGE, (record) => {
            if (!document.hasFocus()) {
                document.title = "New message...";
            }
            setMessages(record)
        })

    }, [socket])

    return (
        <SocketContext.Provider
            value={{ socket, username, setUsername, roomId, rooms, messages, setMessages }}
            {...props}
        />

    )
}
export const useSockets = () => useContext(SocketContext)
export default SocketsProvider;