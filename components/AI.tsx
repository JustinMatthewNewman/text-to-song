// AI.tsx
import React from "react";
import SongInput from "./SongInput";
import SongOutput from "./SongOutput";
import { useChat } from "ai/react";
type Props = {
    chatId: string;
  };
const AI: React.FC<Props> = ({ chatId }: Props) => {
  const { messages, input,  handleInputChange, handleSubmit } = useChat();

  console.log(messages);
  console.log(input);

  return (
    <main className="mx-auto w-full h-screen max-w-lg p-24 flex flex-col">
      <SongOutput chatId={chatId} messages={messages} />
      <SongInput
        chatId={chatId}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
    </main>
  );
};

export default AI;
