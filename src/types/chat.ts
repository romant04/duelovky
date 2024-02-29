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
  created_at: Date;
}

export enum GameChatMessages {
  "AHOJ" = "Ahoj 👋",
  "DOBRA_HRA" = "Dobrá hra 🎮👍",
  "WOW" = "Wow! 😲🌟",
  "DOBRY_POKUS" = "Dobrý pokus! 🎯",
  "PEKNY_KOUSEK" = "Pěkný kousek! 👏",
  "NEMEL_JSEM_SANCI" = "Neměl jsem šanci! 😅",
  "UPS" = "Ups 🙈",
}
