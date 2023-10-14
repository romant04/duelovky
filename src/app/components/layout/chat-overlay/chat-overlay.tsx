"use client";

import { FC, FormEvent, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faComment,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  closeChatLayout,
  openChatLayout,
  selectChat,
} from "@/store/chat/chat-slice";
import { clsx } from "clsx";
import useSWR from "swr";
import { SupabaseUser } from "@/types/auth";
import { fetcher } from "@/app/providers/swr-fetcher";
import { Message } from "@/types/chat";
import { toast } from "react-toastify";
import { LoadingSpinner } from "@/app/components/loading-spinner";
import { ChatBubble } from "@/app/components/layout/chat-overlay/chat-bubble";
import { supabase } from "../../../../../supabase";

export const ChatOverlay: FC = () => {
  const dispatch = useDispatch();
  const { isOpen, openedChat } = useSelector(
    (state: RootState) => state.chatLayout
  );
  const user = useSelector((state: RootState) => state.user.user);
  const [gotOpened, setGotOpened] = useState(false);
  const { data: friends, mutate } = useSWR<SupabaseUser[]>(
    `/api/friends/getFriends?token=${user?.id}`,
    fetcher
  );
  const [friendSelectorOpened, setFriendSelectorOpened] = useState(false);
  const [messages, setMessages] = useState<Message[]>();
  const [loading, setLoading] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setGotOpened(isOpen);
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [isOpen]);

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
        (payload) => {
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
        (payload) => {
          fetchMessages();
        }
      )
      .subscribe();
  };

  useEffect(() => {
    if (openedChat) {
      setLoading(true);
      void fetchMessages();
      setLoading(false);
      void subscribeToChat();
    }
  }, [openedChat]);

  const handleChatSelect = (friend: SupabaseUser) => {
    dispatch(
      selectChat({
        id: user?.id as number,
        friend: { id: friend.id, username: friend.username },
      })
    );
    setFriendSelectorOpened(false);
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

  return (
    <>
      {isOpen ? (
        <div className="fixed bottom-10 right-10 w-96 bg-gray-200">
          <div className="relative flex items-center justify-between bg-lime-600 px-2 py-1">
            {friendSelectorOpened && (
              <div className="absolute bottom-9 left-0 w-full bg-gray-600 p-2 text-lime-400">
                {friends?.map((friend) => (
                  <div
                    className="cursor-pointer border-b-[1px] border-gray-800 p-2 hover:bg-gray-500"
                    key={friend.id}
                    onClick={() => handleChatSelect(friend)}
                  >
                    {friend.username}
                  </div>
                ))}
              </div>
            )}
            <div
              className="flex cursor-pointer items-center gap-2"
              onClick={() => setFriendSelectorOpened((prev) => !prev)}
            >
              <h2 className="text-lg">
                {openedChat ? openedChat.friend.username : "chat"}
              </h2>
              <FontAwesomeIcon
                size="sm"
                icon={friendSelectorOpened ? faChevronUp : faChevronDown}
              />
            </div>
            <FontAwesomeIcon
              className="cursor-pointer"
              icon={faXmark}
              onClick={() => dispatch(closeChatLayout())}
            />
          </div>
          <div>
            <div
              className={clsx(
                "ease overflow-auto bg-gray-750 p-2 transition-all duration-500",
                gotOpened ? "h-60" : "h-0"
              )}
            >
              {openedChat === null ? (
                <p className="text-sm text-red-500">
                  You have no opened chat, you can open one by selecting above
                </p>
              ) : (
                <div className="flex flex-col gap-1">
                  {messages?.map((msg, i) => (
                    <ChatBubble
                      sender={
                        msg.sender_id === user?.id
                          ? "Já"
                          : openedChat.friend.username
                      }
                      message={msg.message}
                      key={i}
                    />
                  ))}
                  {loading && <LoadingSpinner />}
                </div>
              )}
            </div>
            <form className="flex flex-row" onSubmit={sendMessage}>
              <input
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Tvoje zpráva"
                type="text"
                className="w-full bg-gray-100 p-2 text-black"
              />
              <button
                className="bg-lime-600 px-6 hover:bg-lime-500"
                type="submit"
              >
                Poslat
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div
          className="fixed bottom-10 right-10 cursor-pointer text-lime-600 hover:text-lime-500"
          onClick={() => dispatch(openChatLayout())}
        >
          <FontAwesomeIcon size="2x" icon={faComment} />
        </div>
      )}
    </>
  );
};
