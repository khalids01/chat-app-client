import { EVENTS } from "@/config/socketEvents";
import { useSockets } from "@/context/socket.context";
import {
  Text,
  createStyles,
  Group,
  ScrollArea,
  Stack,
  Button,
  Title,
  TextInput,
} from "@mantine/core";
import { useState } from "react";

const useStyles = createStyles({
  wrapper: {
    height: "100%",
    display: "grid",
    gridTemplateRows: "70px calc(100% - 140px) 70px",
    gridAutoColumns: "auto",
  },
});

function Messages() {
  const { classes } = useStyles();
  const { socket, messages, roomId, username, setMessages, rooms } =
    useSockets();
  const [message, setMessage] = useState("");

  function handleSendMessage(e: any) {
    e.preventDefault();
    if (!String(message).trim() || !roomId || !username) return;

    socket.emit(EVENTS.CLIENT.SEND_ROOM_MESSAGE, { roomId, message });
    const date = new Date();
    setMessages([
      ...messages,
      {
        message,
        username,
        time: `${date.getHours()}:${date.getMinutes()}`,
      },
    ]);
    setMessage("");
  }

  if (!roomId) {
    return <></>;
  }
  console.log({ messages });
  return (
    <section className={classes.wrapper}>
      <Group position="center" p={10} bg={"rgb(35,34,43)"}>
        <Title size={24} variant="gradient" transform="capitalize">
          Room : {rooms[roomId]?.name}
        </Title>
      </Group>
      <ScrollArea py={16}>
        {messages?.length > 0 ? (
          <Stack px={8}>
            {messages?.map((m, i) => (
              <Stack
                key={i}
                px={16}
                spacing={5}
                py={12}
                sx={{
                  width: "70%",
                  marginLeft: username === m.username ? "auto" : 0,
                }}
              >
                <Text
                  align={username === m.username ? "end" : "start"}
                  p="sm"
                  sx={{
                    borderRadius: 8,
                  }}
                  bg={
                    username === m.username ? "cornflowerblue" : "rgb(40,49,56)"
                  }
                  size={"lg"}
                  color={username === m.username ? "white" : "rgb(201,201,201)"}
                >
                  {m.message}
                </Text>
                <Text
                  align={username === m.username ? "end" : "start"}
                  px="sm"
                  size={"sm"}
                  color={username === m.username ? "white" : "rgb(201,201,201)"}
                >
                  {m.username}
                </Text>
                <Text
                  align={username === m.username ? "end" : "start"}
                  px="sm"
                  size={"xs"}
                  color={username === m.username ? "white" : "rgb(201,201,201)"}
                >
                  {m.time}
                </Text>
              </Stack>
            ))}
          </Stack>
        ) : (
          <Stack align="center" justify="center" py={50}>
            <Text size={"lg"}>No message to show</Text>
          </Stack>
        )}
      </ScrollArea>

      <form onSubmit={handleSendMessage}>
        <TextInput
          placeholder="Your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          h="100%"
          styles={{
            wrapper: {
              height: "100%",
            },
            input: {
              height: "100%",
            },
          }}
          rightSection={
            <Button type="submit" variant="gradient">
              Send
            </Button>
          }
          rightSectionWidth={100}
        />
      </form>
    </section>
  );
}

export default Messages;
