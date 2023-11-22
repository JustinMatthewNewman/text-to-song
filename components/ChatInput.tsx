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
  serverTimestamp,
} from "firebase/firestore";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import useSWR from "swr";
import { Card, Select, SelectItem, Textarea } from "@nextui-org/react";

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

  const [loadingVoices, setIsLoadingVoices] = useState(true);


  const [voices, setVoices] = useState<Voice[]>([]);

  useEffect(() => {

    fetch("/api/voices")
      .then((response) => response.json())
      .then((data) => {
        console.log("Data:", data);
        setIsLoadingVoices(false)
        setVoices(data)
      })
      .catch((err) => console.error(err));
  }, []);
  

  const [selectedArtist, setSelectedArtist] = useState<Voice | null>(null);

  const { data: model } = useSWR("model", {
    fallbackData: "text-davinci-003",
  });

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
      { audioUrl: updatedMessage.audioUrl }
    );
  };

  const generateResponse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      console.log(selectedArtist);
      console.log(prompt);
      if ((!prompt && !session) || !selectedArtist) return;
      const input =
        "Write a song in the voice of " +
        selectedArtist.name +
        " rapping about " +
        prompt.trim() +
        ".";
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
      const notification = toast.loading("Generating lyrics...", {
        position: "bottom-right",
      });
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

  const handleVoiceSelection = (uuid: string) => {
    const selectedVoice = voices.find(voice => {
      return voice.voicemodel_uuid === uuid; 
    });
    if (!selectedVoice) {
      return; 
    }
  
    setSelectedArtist(selectedVoice);
  }

  return (
    <div style={{ position: "fixed", left: "50%", top: "120px", transform: "translate(-50%, -50%)" }}  className="mt-24 text-gray-400 text-sm">
              <Card>

      {loadingVoices ? (
        <p>Loading Voices</p>
      ) : (
        <div className="flex flex-col items-center justify-center min-w-md">
        <div className="p-2">

          <Select
            items={voices}
            label="Song voice:"
            placeholder="Select a voice"
            style={{fontSize: '18px'}}
            className="w-[80vw] md:w-[40vw] lg:w-[20vw]"
            selectionMode="single"
            onChange={(voice) => handleVoiceSelection(voice.target.value)}
            >
            {voices.map((voice) => (
              <SelectItem key={voice.voicemodel_uuid} value={voice.voicemodel_uuid}>
                {voice.name}
              </SelectItem>
            ))}
          </Select>
        </div>

        <Textarea
        style={{fontSize: '18px'}}
        label="Song about:"
        className="w-[80vw] md:w-[40vw] lg:w-[20vw]"
        type="text"
        placeholder="Type here..."
        onChange={(e) => setPrompt(e.target.value)}
        disabled={!session}
        autoComplete="off"
        />
      </div>
          
        )}

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
      </Card>
    </div>
  );
}

export default ChatInput;
