// AI.tsx
import React, { useEffect, useRef, useState } from "react";
import SongInput from "./SongInput";
import { useChat } from "ai/react";
import {
  Card,
  CardBody,
  CardHeader,
  CircularProgress,
  Progress,
} from "@nextui-org/react";
import ArchivedSongs from "./ArchivedSongs";

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

  const messageEndRef = useRef<null | HTMLDivElement>(null);
  const [obtainingVocals, setObtainingVocals] = useState<boolean>(false);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "instant" });
    // if (!isLoading) {
    //   setObtainingVocals(true);
    // }
  }, [messages]);

  return (
    <div className="flex flex-col container justify-center items-center mt-20 p-4">
      <Card className="min-w-[80vw] h-[80vh]">
        <CardHeader className="overflow-y-auto items-center justify-center flex-col">
          <ArchivedSongs chatId={chatId} />

          {isLoading && (
            <div
              className="overflow-y-auto h-[200px] p-4 mt-2 items-center justify-center"
              style={{ maxHeight: "100px" }}
            >
              <div className="m-2 items-center justify-center">
                {messages.map((m) => (
                  <div key={m.id}>{m.role === "user" ? "" : m.content}</div>
                ))}
                <div ref={messageEndRef} />
                <Progress
                  size="sm"
                  isIndeterminate
                  aria-label="Loading...3"
                />
                <p className="ml-2">Generating Lyrics...</p>

              </div>
            </div>
          )}
          {obtainingVocals && !isLoading && (
            <div className="flex flex-row items-center mt-2">
              <CircularProgress aria-label="Loading...2" />
              <p className="ml-2">Lyrics obtained! Creating song...</p>
            </div>

          )}
        </CardHeader>

        <CardBody className="p-6">
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
            obtainingVocal={obtainingVocals}
            setObtainingVocal={setObtainingVocals}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default AI;
