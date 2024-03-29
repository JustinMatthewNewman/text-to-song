import { firestore } from "@/firebase/firebase";
import { collection, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { Session } from "next-auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { BsFillMusicPlayerFill } from "react-icons/bs";

type Props = {
  id: string;
  session: Session | null;
};

function DynamicSongMenu({ id, session }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [active, setActive] = useState(false);

  const [messages] = useCollection(
    query(
      collection(
        firestore,
        `users/${session?.user?.uid!}/chats/${id}/messages`
      ),
      orderBy("createdAt", "asc")
    )
  );

  useEffect(() => {
    if (!pathname) return;

    setActive(pathname.includes(id));
  }, [pathname]);

  const removeChat = async () => {
    await deleteDoc(doc(firestore, `users/${session?.user?.uid!}/chats/${id}`));
    router.replace("/");
  };

  return (
    <Link
      href={`/chat/${id}`}
      className={`chatRow justify-center ${active && "bg-gray-700/50"} button`}
    >
      <BsFillMusicPlayerFill className="h-8 w-8" />

      <p className="flex-1 flex md:inline-flex truncate">
        {messages?.docs[messages?.docs.length - 1]?.data().text || "New iPod"}
      </p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5 hover:text-red-700"
        onClick={removeChat}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
        />
      </svg>
    </Link>
  );
}

export default DynamicSongMenu;
