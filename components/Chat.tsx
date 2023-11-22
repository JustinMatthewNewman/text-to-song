"use client";

import { firestore } from "@/firebase/firebase";
import { collection, orderBy, query } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useCollection } from "react-firebase-hooks/firestore";

import Message from "./Message";

type Props = {
  chatId: string;
};

function Chat({ chatId }: Props) {
  const { data: session } = useSession();
  const messageEndRef = useRef<null | HTMLDivElement>(null);

  const [messages] = useCollection(
    session &&
      query(
        collection(
          firestore,
          `users/${session?.user?.uid!}/chats/${chatId}/messages`
        ),
        orderBy("createdAt", "asc")
      )
  );

  useEffect(() => {
    messageEndRef.current?.scrollIntoView();
  }, [messages]);

  return (
    <div className="overflow-y-auto overflow-x-hidden h-screen w-[80vw] md:w-[40vw] rounded-3xl">
      {messages?.empty && <></>}
      {messages?.docs.map((message, index) => (
        <Message key={index} message={message.data()} />
      ))}

      <div ref={messageEndRef} />
    </div>
  );
}

export default Chat;
