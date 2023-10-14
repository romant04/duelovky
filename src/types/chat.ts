export interface CurrentChat {
  id: number;
  friend: {
    id: number;
    username: string;
  };
}

export interface Message {
  sender_id: number;
  receiver_id: number;
  message: string;
}
