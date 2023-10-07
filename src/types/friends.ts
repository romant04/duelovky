interface FriendRequestData {
  sender_id: number;
  receiver_id: number;
  message?: string;
}

interface RecievedFriendRequestData {
  users: {
    username: string;
    id: number;
  };
  message?: string;
}
