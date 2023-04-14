import { Text, Container, Group, Stack, TextInput, Button } from "@mantine/core";
import { useSockets } from "@/context/socket.context";
import { useState } from "react";
import { EVENTS } from "@/config/socketEvents";

function Rooms() {
    const { socket, roomId, rooms } = useSockets()
    const [roomName, setRoomName] = useState('')
    function handleCreateRoom(e: any) {
        e.preventDefault();

        if (!String(roomName).trim()) {
            return
        }

        socket.emit(EVENTS.CLIENT.CREATE_ROOM, { roomName })

        setRoomName('')
    }

    function handleJoinRoom(id: string) {
        if (id === roomId) return;

        socket.emit(EVENTS.CLIENT.JOIN_ROOM, id)
    }

    return (
        <form onSubmit={handleCreateRoom}>
            <TextInput
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder='New room name'
                rightSectionWidth={40}
                size={'md'}
                rightSection={
                    <Button
                        title='Create a new room'
                        variant="light"
                        type='submit'
                        color="cyan"
                        size="md"
                        p={0}
                        fz={'22px'}
                        w={40}
                    >
                        +
                    </Button>
                }
            />

            <Stack mt={16}>
                {
                    rooms ? Object.keys(rooms).map((key, i) => (
                        <Button
                            variant={key === roomId ? "filled" : "light"}
                            color="cyan" key={i}
                            onClick={() => handleJoinRoom(key)}
                        >
                            {rooms[key].name}
                        </Button>
                    )) : null
                }
            </Stack>

        </form>
    );
}

export default Rooms;