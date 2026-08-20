import type { LoanKind } from "@/lib/loans/types";

export type LoanRow = {
  id: string;
  user_id: string;
  kind: LoanKind;
  name: string;
  photo_path: string | null;
  loaned_at: string;
  borrower_name: string;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      loans: {
        Row: LoanRow;
        Insert: {
          id?: string;
          user_id: string;
          kind?: LoanKind;
          name: string;
          photo_path?: string | null;
          loaned_at: string;
          borrower_name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          kind?: LoanKind;
          name?: string;
          photo_path?: string | null;
          loaned_at?: string;
          borrower_name?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
