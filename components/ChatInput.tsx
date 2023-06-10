"use client";

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
  serverTimestamp
} from "firebase/firestore";

import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import useSWR from "swr";
import voiceData from "./voices.json"

import ModelSelection from "./ModelSelection";

type Props = {
  chatId: string;
  
};

type Voice = {
  added_at: number | null;
  architecture: string;
  category: string;
  contributors: string[];
  controls: boolean;
  display_name: string;
  is_active: boolean;
  model_id: string;
  memberships: { name: string; id: number }[];
  is_private: boolean;
  is_primary: boolean;
  name: string;
  symbol_set: string;
  voicemodel_uuid: string;
  hifi_gan_vocoder: string;
  ml_model_id: number;
  speaker_id: number | null; // Update this line
  language: string;
};




function ChatInput({ chatId }: Props) {
  const { data: session } = useSession();
  const [prompt, setPrompt] = useState("");
  const [loading, setIsLoading] = useState(true);
  const [voices, setVoices] = useState([]);

  const [selectedArtist, setSelectedArtist] = useState<Voice | null>(null);

  const { data: model } = useSWR("model", {
    fallbackData: "text-davinci-003",
  });

  const findVoiceIndex = (voice: Voice) => {
    return getVoices().findIndex((v) => v.voicemodel_uuid === voice.voicemodel_uuid);
  };

  const addAudioUrlToMessage = async (audioUrl: string) => {
    const messagesSnapshot = await getDocs(
      query(
        collection(
          firestore,
          `users/${session?.user?.uid!}/chats/${chatId}/messages`
        ),
        orderBy("createdAt", "desc"),
        limit(1)
      )
    );
  
    const lastMessage = messagesSnapshot.docs[0];
    const messageId = lastMessage.id;
    const messageData = lastMessage.data() as Message;

    const updatedMessage: MessageWithAudio = {
      ...messageData,
      audioUrl: audioUrl,
    };
  

  
    await updateDoc(
  doc(
    firestore,
    `users/${session?.user?.uid!}/chats/${chatId}/messages/${messageId}`
  ),
  { "audioUrl": updatedMessage.audioUrl }
);

  };
  
  

  const getVoices = () => {
    // return voiceData.filter(voice => {
    //   const displayName = voice.display_name.toLowerCase();
    //   return (displayName === 'jay-z' 
    //   || displayName === 'snoop dogg' 
    //   || displayName === 'j. cole'
    //   || displayName === 'nicki minaj (rapping)'
    //   || displayName === '2pac'
    //   || displayName === 'the notorious b.i.g.'
    //   || displayName === 'the notorious b.i.g.'
    //   || displayName === 'the notorious b.i.g.'
    //   || displayName === 'the notorious b.i.g.'
    //   || displayName === 'the notorious b.i.g.'
    //   || displayName === 'the notorious b.i.g.'
    //   || displayName === 'Saul Goodman'
    //   || displayName === 'lady gaga (singing)'
      
      
    //   );
    // });
    return voiceData;
  };
  

  const handleVoiceSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = parseInt(e.target.value);
    setSelectedArtist(getVoices()[selectedIndex]);
  };
  

  const generateResponse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      console.log(selectedArtist)
      if ((!prompt && !session)||(!selectedArtist)) return;
      const input = "Write a song in the voice of " + selectedArtist.name + " rapping about " + prompt.trim() + ".";
      setPrompt("");
      setIsLoading(false);

      const message: Message = {
        text: input,
        createdAt: serverTimestamp(),
        user: {
          _id: session?.user.uid!,
          name: session?.user.name!,
          email: session?.user.email!,
          avatar:
            session?.user.image ||
            `https://ui-avatars.com/api/?name=${session?.user.name!}`,
        },
        
      };

      await addDoc(
        collection(
          firestore,
          `users/${session?.user?.uid!}/chats/${chatId}/messages`
        ),
        message
      );

      // loading
      const notification = toast.loading("Generating lyrics...");

      await fetch("/api/askQuestion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: input,
          chatId,
          model,
          session,
          selectedArtist: selectedArtist,
        }),
      })
        .then((response) => response.json())
        .then(({ answer, audioUrl }) => {
          // Tost Notification
          toast.success("Lyrics!", {
            id: notification,
          });
      
          setIsLoading(true);
      
          // Pass the audioUrl to a function that adds it to the message
          addAudioUrlToMessage(audioUrl);
        });
      
    } catch (error: any) {
      console.log(error.message);
    }
  };

  // console.log(selectedArtist)

  return (
    <div className="bg-gray-700/30 text-gray-400 text-sm">





<div className="mt-1 text-center text-white">
{/* <img
        src="https://drive.google.com/uc?export=download&id=1fj7OO7X2uFYOI0zM5ZfjYB27vdI43qEr"
        alt="logo"
        className="mx-auto p-4 App-logo"
      /> */}
      <br/>
        <label htmlFor="rapper-select">Write a song in the voice of: </label>
      <div className="p-2">
        <div>
<select
  style={{
    backgroundColor: "#353942",
    color: "#fff",
    borderRadius: "4px",
    padding: "4px",
    width: "230px",
  }}
  value={selectedArtist ? findVoiceIndex(selectedArtist) : ""}
  onChange={handleVoiceSelection}
>
  <option value="" disabled>
    Select
  </option>
  {getVoices().map((voice, index) => (
    <option key={voice.voicemodel_uuid} value={index}>
      {voice.display_name}
    </option>
  ))}
</select>


        </div>
      </div>
      <br />

      <label htmlFor="song-topic-input">Singing about: </label>
      <input
        type="text"
        placeholder="Type here..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={!session}
        autoComplete="off"
        
        style={{
          backgroundColor: "#353942",
          color: "#fff",
          borderRadius: "4px",
          padding: "4px",
        }}
      />

    </div>







      <form onSubmit={generateResponse} className="p-5 text-center">
        <input
          
          className={`bg-transparent focus:outline-none flex-1 disabled:cursor-not-allowed disabled:text-gray-700 ${
            !loading && "animate-pulse"
          }`}
        />

        {loading ? (
          <button
            type="submit"
            disabled={!prompt || !session}
            className="button text-white font-bold px-4 py-2 rounded disabled:bg-gray-700 disabled:cursor-not-allowed"
          >
            Create
          </button>
        ) : (
          <button
            type="submit"
            disabled={!session}
            className="bg-[#434343] hover:opacity-50 text-white font-bold px-4 py-2 rounded disabled:bg-gray-700 disabled:cursor-not-allowed"
          >
           Create
          </button>
        )}
      </form>
      {/* <div className="md:hidden">
        <ModelSelection />
      </div> */}
    </div>
  );
}

export default ChatInput;
