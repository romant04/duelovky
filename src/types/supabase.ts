export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      chat: {
        Row: {
          created_at: string | null;
          id: number;
          message: string;
          receiver_id: number;
          sender_id: number;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          message: string;
          receiver_id: number;
          sender_id: number;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          message?: string;
          receiver_id?: number;
          sender_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "chat_receiver_id_fkey";
            columns: ["receiver_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chat_sender_id_fkey";
            columns: ["sender_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      friend_request: {
        Row: {
          message: string | null;
          receiver_id: number;
          sender_id: number;
        };
        Insert: {
          message?: string | null;
          receiver_id: number;
          sender_id: number;
        };
        Update: {
          message?: string | null;
          receiver_id?: number;
          sender_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "friend_request_receiver_id_fkey";
            columns: ["receiver_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "friend_request_sender_id_fkey";
            columns: ["sender_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      friends: {
        Row: {
          user1_id: number;
          user2_id: number;
        };
        Insert: {
          user1_id: number;
          user2_id: number;
        };
        Update: {
          user1_id?: number;
          user2_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "friends_user1_id_fkey";
            columns: ["user1_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "friends_user2_id_fkey";
            columns: ["user2_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          email: string;
          fotbal_mmr: number;
          horolezci_mmr: number;
          id: number;
          password: string;
          prsi_mmr: number;
          username: string;
        };
        Insert: {
          email?: string;
          fotbal_mmr?: number;
          horolezci_mmr?: number;
          id?: number;
          password?: string;
          prsi_mmr?: number;
          username?: string;
        };
        Update: {
          email?: string;
          fotbal_mmr?: number;
          horolezci_mmr?: number;
          id?: number;
          password?: string;
          prsi_mmr?: number;
          username?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
