// AI.tsx
import React from "react";
import SongInput from "./SongInput";
import SongOutput from "./SongOutput";
import { useChat } from "ai/react";
import { CircularProgress } from "@nextui-org/react";
type Props = {
    chatId: string;
  };
const AI: React.FC<Props> = ({ chatId }: Props) => {
  const {     messages,
    append,
    input,
    setInput,
    handleInputChange,
    isLoading,
    stop, } = useChat();

  console.log(messages);
  console.log(input);

  return (
    <main className="mx-auto w-full h-screen max-w-lg p-24 flex flex-col justify-center items-center">
      <SongOutput chatId={chatId} messages={messages} />
      {isLoading && (
            <CircularProgress/>
          )}
      <SongInput
        chatId={chatId}
        input={input}
        handleInputChange={handleInputChange}
        setInput={setInput}
        append={append}
        isLoading={isLoading}
        stop={stop} messages={[]} error={undefined}      
        />
    </main>
  );
};

export default AI;
