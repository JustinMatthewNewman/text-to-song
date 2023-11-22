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
import { Button, Select, SelectItem, Textarea } from "@nextui-org/react";
import { CircularProgress } from "@nextui-org/react";

interface SongInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}


/**
 * Types for the TTS API voices 
 */
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



const SongInput: React.FC<SongInputProps & { chatId: string }> = ({
    input,
    handleInputChange,
    handleSubmit,
    chatId,
  }) => {


  const { data: session } = useSession();
  const [prompt, setPrompt] = useState("");
  const [loading, setIsLoading] = useState(true);

  const [loadingVoices, setIsLoadingVoices] = useState(true);
  const [voices, setVoices] = useState<Voice[]>([]);

  /**
   * Fetch available voiices from API
   */
  useEffect(() => {
    fetch("/api/voices")
      .then((response) => response.json())
      .then((data) => {
        console.log("Data:", data);
        setIsLoadingVoices(false);
        setVoices(data);
      })
      .catch((err) => console.error(err));
  }, []);


  /**
   * Logic to handle the vioce selection
   */
  const [selectedArtist, setSelectedArtist] = useState<Voice | null>(null);
  const handleVoiceSelection = (uuid: string) => {
    const selectedVoice = voices.find((voice) => {
      return voice.voicemodel_uuid === uuid;
    });
    if (!selectedVoice) {
      return;
    }

    setSelectedArtist(selectedVoice);
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

      handleSubmit(e)

    } catch (error: any) {
      console.log(error.message);
    }
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
      { audioUrl: updatedMessage.audioUrl }
    );
  };

  return (
    // <form className="flex space-x-4" onSubmit={handleSubmit}>
    //   <input
    //     className="rounded-md p-2 text-black"
    //     value={input}
    //     onChange={handleInputChange}
    //     placeholder="Say something..."
    //   />
    //   <button
    //     className="border-solid border-2 border-white p-2 rounded-md"
    //     type="submit"
    //   >
    //     Send
    //   </button>
    // </form>
    <div className="mt-2 text-gray-400 text-sm">
      {loadingVoices ? (
        <div className="flex items-center justify-center h-screen">
          <CircularProgress
            size="lg"
            color="secondary"
            aria-label="Loading..."
          />
        </div>
      ) : (
        <div>
          <div className="flex flex-col items-center justify-center text-center">
            <div className="p-2">
              <Select
                items={voices}
                label="Song voice:"
                placeholder="Select a voice"
                style={{ fontSize: "18px" }}
                className="w-[80vw] md:w-[40vw]"
                selectionMode="single"
                onChange={(voice) => handleVoiceSelection(voice.target.value)}
              >
                {voices.map((voice) => (
                  <SelectItem
                    key={voice.voicemodel_uuid}
                    value={voice.voicemodel_uuid}
                  >
                    {voice.name}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <Textarea
              style={{ fontSize: "18px" }}
              label="Song about:"
              className="w-[80vw] md:w-[40vw]"
              type="text"
              placeholder="Type here..."
              onChange={(e) => setPrompt(e.target.value)}
              isDisabled={!session}
              autoComplete="off"
            />
          </div>

          <form onSubmit={handleSubmit} className="p-5 text-center">
                  <input
        className="rounded-md p-2 text-black"
        value={input}
        onChange={handleInputChange}
        placeholder="Say something..."
      />
            <Button
              type="submit"
              isDisabled={
                prompt.length === 0 ||
                selectedArtist === null ||
                !session ||
                !loading
              }
              radius="full"
              className="bg-gradient-to-tr from-pink-500 to-purple-500 text-white shadow-lg"
            >
              Create
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SongInput;
