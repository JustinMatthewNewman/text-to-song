// SongOutput.tsx
import { FunctionCall } from "ai";
import React, { useEffect, useRef } from "react";

import Message from "./Message";
import { firestore } from "@/firebase/firebase";
import { collection, orderBy, query } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";


interface SongOutputProps {
  messages: Array<{
    id: string;
    createdAt?: Date;
    content: string;
    ui?: string | JSX.Element | JSX.Element[] | null | undefined;
    role: "system" | "user" | "assistant" | "function";
    name?: string;
    function_call?: string | FunctionCall;
  }>;
  isLoading: boolean
}

const SongOutput: React.FC<SongOutputProps & { chatId: string }> = ({
  messages,
  isLoading,
  chatId,
}) => {
  
  const { data: session } = useSession();
  const messageEndRef = useRef<null | HTMLDivElement>(null);

  const [storedSongs] = useCollection(
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
  }, [storedSongs]);

  
  return (
    // <div className="overflow-y-auto overflow-x-hidden h-screen w-[80vw] md:w-[40vw] rounded-3xl">
    //   <section className="mb-auto m flex flex-col items-center justify-center p-4">
    //     {messages.map((m) => (
    //       <div className="mb-4" key={m.id}>
    //         {m.role === "user" ? "" : "MelodifyLabs: "}
    //         {m.role === 'user' ? "": m.content}
    //       </div>
    //     ))}
    //   </section>
    // </div>
    <div className="overflow-y-auto overflow-x-hidden h-screen w-[80vw] md:w-[40vw] rounded-3xl">
      {storedSongs?.empty && <></>}
      {storedSongs?.docs.map((message, index) => (
        <Message key={index} message={message.data()} />
      ))}

      <div ref={messageEndRef} />
    </div>
  );
};

export default SongOutput;
