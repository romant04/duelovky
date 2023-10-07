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
      friend_request: {
        Row: {
          created_at: string;
          id: number;
          message: string | null;
          reciever_id: number;
          sender_id: number;
        };
        Insert: {
          created_at?: string;
          id?: number;
          message?: string | null;
          reciever_id: number;
          sender_id: number;
        };
        Update: {
          created_at?: string;
          id?: number;
          message?: string | null;
          reciever_id?: number;
          sender_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "friend_request_reciever_id_fkey";
            columns: ["reciever_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "friend_request_sender_id_fkey";
            columns: ["sender_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      friends: {
        Row: {
          id: number;
          user1_id: number;
          user2_id: number;
        };
        Insert: {
          id?: number;
          user1_id: number;
          user2_id: number;
        };
        Update: {
          id?: number;
          user1_id?: number;
          user2_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "friends_user1_id_fkey";
            columns: ["user1_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "friends_user2_id_fkey";
            columns: ["user2_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          created_at: string;
          email: string | null;
          id: number;
          password: string | null;
          uid: string | null;
          username: string | null;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          id?: number;
          password?: string | null;
          uid?: string | null;
          username?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          id?: number;
          password?: string | null;
          uid?: string | null;
          username?: string | null;
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
