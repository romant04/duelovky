"use client";

import { FC, FormEvent, useEffect, useState } from "react";
import { ChatBubble } from "@/app/chat/components/chat-bubble";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Message } from "@/types/chat";
import { supabase } from "../../../../supabase";
import { LoadingSpinnerGreen } from "@/app/components/loading-spinner-green";
import { toast } from "react-toastify";
import { NotSigned } from "@/app/hoc/not-signed";

const Chat: FC = () => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>();
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);
  const { openedChat } = useSelector((state: RootState) => state.chatLayout);

  const fetchMessages = async () => {
    const data = await fetch(
      `/api/chat/getMessages?id=${user?.id}&friend_id=${openedChat?.friend.id}`
    );
    const res = (await data.json()) as Message[];
    setMessages(res);
  };

  const subscribeToChat = async () => {
    await supabase
      .channel("any")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat",
          filter: `receiver_id=eq.${user?.id}`,
        },
        () => {
          fetchMessages();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat",
          filter: `sender_id=eq.${user?.id}`,
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();
  };

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (currentMessage === "") {
      toast.error("Nemůžeš poslat prázdnou zprávu");
      return;
    }

    const messageData = {
      id: user?.id,
      receiver_id: openedChat?.friend.id,
      message: currentMessage,
    };
    await fetch(`/api/chat/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageData),
    });

    setCurrentMessage("");
  };

  useEffect(() => {
    if (openedChat) {
      setLoading(true);
      void fetchMessages();
      setLoading(false);
      void subscribeToChat();
    }
  }, [openedChat]);

  console.log(messages);

  return (
    <div className="flex w-3/4 flex-col justify-between bg-gray-900 p-4">
      <div className="flex flex-col gap-1">
        {loading ? (
          <LoadingSpinnerGreen />
        ) : (
          openedChat &&
          messages?.map((msg, i) => (
            <ChatBubble
              sender={
                msg.sender_id === user?.id ? "Já" : openedChat.friend.username
              }
              message={msg.message}
              key={i}
            />
          ))
        )}
      </div>
      <form className="flex w-full gap-1" onSubmit={sendMessage}>
        <input
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          type="text"
          placeholder="Tvoje zpráva"
          className="w-3/4 rounded-md bg-gray-200 px-2 py-3 text-black"
        />
        <button
          type="submit"
          className="w-1/4 rounded-md bg-lime-600 hover:bg-lime-500"
        >
          Poslat
        </button>
      </form>
    </div>
  );
};

export default NotSigned(Chat);
