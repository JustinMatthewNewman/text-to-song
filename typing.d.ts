// interface Message {
//   text: string;

//   createdAt: admin.firestore.Timestamp;
//   user: {
//     _id: string;
//     name: string;
//     email: string;
//     avatar: string;
//   };
// }

interface MessageWithAudio extends Message {
  audioUrl?: string;
}

interface Message {
  id: string;
  createdAt?: Date;
  content: string;
  ui?: string | JSX.Element | JSX.Element[] | null | undefined;
  role: 'system' | 'user' | 'assistant' | 'function';
  /**
   * If the message has a role of `function`, the `name` field is the name of the function.
   * Otherwise, the name field should not be set.
   */
  name?: string;
  /**
   * If the assistant role makes a function call, the `function_call` field
   * contains the function call name and arguments. Otherwise, the field should
   * not be set.
   */
  function_call?: string | FunctionCall;
}