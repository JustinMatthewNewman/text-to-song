"use client";

import { firestore } from "@/firebase/firebase";
import { collection, orderBy, query } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useCollection } from "react-firebase-hooks/firestore";

import Song from "./Song";

const ArchivedSongs: React.FC<{ chatId: string }> = ({ chatId }) => {
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
    <div className="overflow-y-auto overflow-x-hidden rounded-2xl max-h-[40vh] w-full">
      {messages?.empty && <></>}
      {messages?.docs.map((message, index) => (
          <Song key={index} message={message.data()} />
      ))}
      <div ref={messageEndRef} />
    </div>
  );
};

export default ArchivedSongs;
