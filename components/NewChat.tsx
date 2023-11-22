import { firestore } from "@/firebase/firebase";
import { Button } from "@nextui-org/button";
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  session: Session | null;
};

function NewChat({ session }: Props) {
  const router = useRouter();

  const createNewChat = async () => {
    try {
      if (!session) return;

      const doc = await addDoc(
        collection(firestore, `users/${session.user.uid}/chats`),
        {
          userId: session.user.uid,
          userEmail: session.user.email,
          createdAt: serverTimestamp() as Timestamp,
        }
      );

      if (!doc.id) return;

      router.push(`/chat/${doc.id}`);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <div className="items-center justify-center" onClick={createNewChat}>
      <Button
        onPress={createNewChat}
        radius="full"
        className="bg-gradient-to-tr from-pink-500 to-blue-500 text-white shadow-lg m-12"
        size="lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path
            fillRule="evenodd"
            d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
            clipRule="evenodd"
          />
        </svg>{" "}
        New Song
      </Button>
    </div>
  );
}

export default NewChat;
