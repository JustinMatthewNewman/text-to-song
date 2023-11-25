"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Button, Select, SelectItem, Textarea } from "@nextui-org/react";
import { CircularProgress } from "@nextui-org/react";
import { uuid } from "uuidv4";
import { ChatRequestOptions, CreateMessage } from "ai";

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

interface SongInputProps {
  messages: Message[];
  error: undefined | Error;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  isLoading: boolean;
  stop: () => void;
}

const SongInput: React.FC<SongInputProps & { chatId: string }> = ({
  chatId,
  append,
  stop,
}) => {
  const { data: session } = useSession();
  const [prompt, setPrompt] = useState("");

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
      if ((!prompt && !session) || !selectedArtist) return;

      const inputContent =
        "Write a song in the voice of " +
        selectedArtist?.name +
        " rapping about " +
        prompt.trim() +
        ".";

      setPrompt("");

      const userMessage: Message = {
        createdAt: new Date(),
        content: inputContent,
        role: "user",
        id: uuid(),
      };

      await append(userMessage);

      stop(); // Stop any ongoing requests if they exist

    } catch (error: any) {
      console.error(error.message);
    }
  };

 
  return (
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


          <form onSubmit={generateResponse} className="p-5 text-center">
            <Button
              type="submit"
              isDisabled={
                prompt.length === 0 ||
                selectedArtist === null ||
                !session
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
