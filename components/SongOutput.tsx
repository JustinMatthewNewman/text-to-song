// SongOutput.tsx
import { FunctionCall } from 'ai';
import React from 'react';


interface SongOutputProps {
  messages: Array< {
    id: string;
    createdAt?: Date;
    content: string;
    ui?: string | JSX.Element | JSX.Element[] | null | undefined;
    role: 'system' | 'user' | 'assistant' | 'function';
    name?: string;
    function_call?: string | FunctionCall;
}>;
}

const SongOutput: React.FC<SongOutputProps & { chatId: string }> = ({ messages, chatId }) => {
    return (
    <section className="mb-auto m">
      {messages.map((m) => (
        <div className="mb-4" key={m.id}>
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
        </div>
      ))}
    </section>
  );
};

export default SongOutput;
