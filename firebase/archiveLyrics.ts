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
}