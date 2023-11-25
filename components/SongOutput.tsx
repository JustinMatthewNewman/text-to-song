// SongOutput.tsx
import { FunctionCall } from "ai";
import React, { useEffect } from "react";

interface SongOutputProps {
  messages: Array<{
    id: string;
    createdAt?: Date;
    content: string;
    ui?: string | JSX.Element | JSX.Element[] | null | undefined;
    role: "system" | "user" | "assistant" | "function";
    name?: string;
    function_call?: string | FunctionCall;
  }>;
  isLoading: boolean
}

const SongOutput: React.FC<SongOutputProps & { chatId: string }> = ({
  messages,
  isLoading,
  chatId,
}) => {
  
  
  
  return (
    <div className="overflow-y-auto overflow-x-hidden h-screen w-[80vw] md:w-[40vw] rounded-3xl">
      <section className="mb-auto m flex flex-col items-center justify-center p-4">
        {messages.map((m) => (
          <div className="mb-4" key={m.id}>
            {m.role === "user" ? "" : "MelodifyLabs: "}
            {m.role === 'user' ? "": m.content}
          </div>
        ))}
      </section>
    </div>
  );
};

export default SongOutput;
