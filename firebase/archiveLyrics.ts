import { firestore } from "@/firebase/firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

export async function archiveLyrics(userMessage: Message) {
  console.log(userMessage)

  // const message: Message = {
  //   text: input,
  //   createdAt: serverTimestamp(),
  //   user: {
  //     _id: session?.user.uid!,
  //     name: session?.user.name!,
  //     email: session?.user.email!,
  //     avatar:
  //       session?.user.image ||
  //       `https://ui-avatars.com/api/?name=${session?.user.name!}`,
  //   },
  // };

  // await addDoc(
  //   collection(
  //     firestore,
  //     `users/${session?.user?.uid!}/chats/${chatId}/messages`
  //   ),
  //   message
  // );

}