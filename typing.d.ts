interface Message {
  text: string;

  createdAt: admin.firestore.Timestamp;
  user: {
    _id: string;
    name: string;
    email: string;
    avatar: string;
  };
}

interface MessageWithAudio extends Message {
  audioUrl?: string;
}

