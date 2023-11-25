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
  const {
    messages,
    append,
    input,
    setInput,
    handleInputChange,
    isLoading,
    stop,
  } = useChat();


  return (
    <div className="mx-auto w-full h-screen max-w-lg p-24 flex flex-col justify-center items-center">
      
      <SongOutput chatId={chatId} messages={messages} isLoading={false} />

      {isLoading && <CircularProgress aria-label="Loading...2" />}

      <SongInput
        chatId={chatId}
        input={input}
        handleInputChange={handleInputChange}
        setInput={setInput}
        append={append}
        isLoading={isLoading}
        stop={stop}
        messages={messages}
        error={undefined}
      />

    </div>
  );
};

export default AI;
