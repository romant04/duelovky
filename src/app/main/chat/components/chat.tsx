"use client";

import { FC, FormEvent, useEffect, useState } from "react";
import { ChatBubble } from "./chat-bubble";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Message } from "@/types/chat";
import { supabase } from "../../../../../supabase";
import { LoadingSpinnerGreen } from "@/app/components/loading-spinner-green";
import { toast } from "react-toastify";
import { useMediaQuery } from "@/utils/useMediaQuery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { resetChat } from "@/store/chat/chat-slice";
import { LoadingSpinner } from "@/app/components/loading-spinner";

export const Chat: FC = () => {
  const dispatch = useDispatch();
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>();
  const [loading, setLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);
  const { openedChat } = useSelector((state: RootState) => state.chatLayout);

  const fetchMessages = async () => {
    const data = await fetch(
      `/api/chat/getMessages?id=${user?.id}&friend_id=${openedChat?.friend.id}`
    );
    const res = (await data.json()) as Message[];
    setMessages(res);
    setLoading(false);
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
    if (sendLoading) {
      return;
    }

    if (currentMessage === "") {
      toast.error("Nemůžeš poslat prázdnou zprávu");
      return;
    }

    const temp = currentMessage;

    setCurrentMessage("");

    const messageData = {
      id: user?.id,
      receiver_id: openedChat?.friend.id,
      message: temp,
    };

    setSendLoading(true);
    await fetch(`/api/chat/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageData),
    });
    setSendLoading(false);
  };

  const closeChat = () => {
    dispatch(resetChat());
  };

  useEffect(() => {
    if (openedChat) {
      setLoading(true);
      void fetchMessages();
      void subscribeToChat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openedChat]);

  const mdUp = useMediaQuery("(min-width: 968px)");

  return (
    <div className="flex h-full w-full flex-col bg-gray-900 p-4 md:w-3/4">
      {!mdUp && (
        <div className="flex items-center gap-5">
          <FontAwesomeIcon
            onClick={closeChat}
            className="cursor-pointer"
            size="xl"
            icon={faArrowLeft}
          />
          <div className="flex items-center gap-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-500">
              {openedChat?.friend.username.charAt(0).toUpperCase()}
            </div>
            <p>{openedChat?.friend.username}</p>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-1 py-5">
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
      <form className="mt-auto flex w-full gap-1" onSubmit={sendMessage}>
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
          {sendLoading ? <LoadingSpinner /> : "Poslat"}
        </button>
      </form>
    </div>
  );
};
