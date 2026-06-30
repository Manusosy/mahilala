export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      articles: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string | null;
          body: string;
          category_id: string | null;
          cover_image_url: string | null;
          tag_color: string | null;
          is_published: boolean;
          is_featured: boolean;
          published_at: string | null;
          author_id: string | null;
          view_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt?: string | null;
          body?: string;
          category_id?: string | null;
          cover_image_url?: string | null;
          tag_color?: string | null;
          is_published?: boolean;
          is_featured?: boolean;
          published_at?: string | null;
          author_id?: string | null;
          view_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['articles']['Insert']>;
      };
      categories: {
        Row: { id: string; name: string; slug: string; color: string; created_at: string };
        Insert: { id?: string; name: string; slug: string; color?: string; created_at?: string };
        Update: Partial<Database['public']['Tables']['categories']['Insert']>;
      };
      tags: {
        Row: { id: string; name: string; slug: string; created_at: string };
        Insert: { id?: string; name: string; slug: string; created_at?: string };
        Update: Partial<Database['public']['Tables']['tags']['Insert']>;
      };
      article_tags: {
        Row: { article_id: string; tag_id: string };
        Insert: { article_id: string; tag_id: string };
        Update: { article_id?: string; tag_id?: string };
      };
      programs: {
        Row: {
          id: string; slug: string; name: string; pillar: string;
          countries: string[]; summary: string | null; body: string;
          key_output: string | null; cover_image_url: string | null;
          status: string; start_date: string | null; end_date: string | null;
          is_published: boolean; sort_order: number;
          objectives: string | null; challenges: string | null; impact: string | null;
          focus_areas: string[]; funding_status: string;
          funding_goal: number; funding_raised: number;
          gallery: string[]; video_url: string | null;
          created_at: string; updated_at: string;
        };
        Insert: {
          id?: string; slug: string; name: string; pillar: string;
          countries?: string[]; summary?: string | null; body?: string;
          key_output?: string | null; cover_image_url?: string | null;
          status?: string; start_date?: string | null; end_date?: string | null;
          is_published?: boolean; sort_order?: number;
          objectives?: string | null; challenges?: string | null; impact?: string | null;
          focus_areas?: string[]; funding_status?: string;
          funding_goal?: number; funding_raised?: number;
          gallery?: string[]; video_url?: string | null;
          created_at?: string; updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['programs']['Insert']>;
      };
      reports: {
        Row: {
          id: string; title: string; category: string; report_type: string | null;
          description: string | null; file_url: string | null; cover_image_url: string | null;
          page_count: number | null; published_date: string | null;
          is_published: boolean; is_featured: boolean; color: string;
          download_count: number; created_at: string; updated_at: string;
        };
        Insert: {
          id?: string; title: string; category: string; report_type?: string | null;
          description?: string | null; file_url?: string | null; cover_image_url?: string | null;
          page_count?: number | null; published_date?: string | null;
          is_published?: boolean; is_featured?: boolean; color?: string; created_at?: string; updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['reports']['Insert']>;
      };
      partners: {
        Row: {
          id: string; name: string; logo_url: string | null; website_url: string | null;
          country: string | null; description: string | null; type: string;
          is_founding: boolean; is_active: boolean; sort_order: number;
          created_at: string; updated_at: string;
        };
        Insert: {
          id?: string; name: string; logo_url?: string | null; website_url?: string | null;
          country?: string | null; description?: string | null; type?: string;
          is_founding?: boolean; is_active?: boolean; sort_order?: number; created_at?: string; updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['partners']['Insert']>;
      };
      gallery_items: {
        Row: {
          id: string; image_url: string; caption: string | null; category: string | null;
          country: string | null; is_published: boolean; sort_order: number; created_at: string;
        };
        Insert: {
          id?: string; image_url: string; caption?: string | null; category?: string | null;
          country?: string | null; is_published?: boolean; sort_order?: number; created_at?: string; updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['gallery_items']['Insert']>;
      };
      team_members: {
        Row: {
          id: string; name: string; title: string; bio: string | null;
          photo_url: string | null; country: string | null; organization: string | null;
          email: string | null; linkedin_url: string | null; role: string;
          sort_order: number; is_active: boolean; created_at: string; updated_at: string;
        };
        Insert: {
          id?: string; name: string; title: string; bio?: string | null;
          photo_url?: string | null; country?: string | null; organization?: string | null;
          email?: string | null; linkedin_url?: string | null; role?: string;
          sort_order?: number; is_active?: boolean; created_at?: string; updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['team_members']['Insert']>;
      };
      contact_submissions: {
        Row: {
          id: string; name: string; organization: string | null; email: string;
          country: string | null; purpose: string | null; message: string;
          status: string; replied_at: string | null; created_at: string;
        };
        Insert: {
          id?: string; name: string; organization?: string | null; email: string;
          country?: string | null; purpose?: string | null; message: string;
          status?: string; replied_at?: string | null; created_at?: string; updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['contact_submissions']['Insert']>;
      };
      membership_applications: {
        Row: {
          id: string; org_name: string; org_type: string; country: string;
          website: string | null; contact_name: string; contact_title: string | null;
          contact_email: string; contact_phone: string | null; focus_areas: string[];
          motivation: string; status: string; reviewed_by: string | null;
          reviewed_at: string | null; notes: string | null; created_at: string;
        };
        Insert: {
          id?: string; org_name: string; org_type: string; country: string;
          website?: string | null; contact_name: string; contact_title?: string | null;
          contact_email: string; contact_phone?: string | null; focus_areas?: string[];
          motivation: string; status?: string; reviewed_by?: string | null;
          reviewed_at?: string | null; notes?: string | null; created_at?: string; updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['membership_applications']['Insert']>;
      };
      newsletter_subscribers: {
        Row: { id: string; email: string; is_subscribed: boolean; subscribed_at: string; unsubscribed_at: string | null };
        Insert: { id?: string; email: string; is_subscribed?: boolean };
        Update: { email?: string; is_subscribed?: boolean; unsubscribed_at?: string | null };
      };
      donations: {
        Row: { id: string; donor_name: string | null; donor_email: string | null; amount: number | null; currency: string; purpose: string | null; status: string; payment_ref: string | null; created_at: string };
        Insert: { donor_name?: string | null; donor_email?: string | null; amount?: number | null; currency?: string; purpose?: string | null; status?: string; payment_ref?: string | null; created_at?: string; updated_at?: string; };
        Update: Partial<Database['public']['Tables']['donations']['Insert']>;
      };
      site_settings: {
        Row: { key: string; value: Json; updated_at: string };
        Insert: { key: string; value: Json; updated_at?: string };
        Update: { value?: Json; updated_at?: string };
      };
      admin_profiles: {
        Row: { id: string; full_name: string | null; avatar_url: string | null; role: string; country: string | null; is_active: boolean; last_login: string | null; created_at: string };
        Insert: { id: string; full_name?: string | null; avatar_url?: string | null; role?: string; country?: string | null; is_active?: boolean; last_login?: string | null; created_at?: string; updated_at?: string; };
        Update: Partial<Database['public']['Tables']['admin_profiles']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// Convenience row types
export type Article = Database['public']['Tables']['articles']['Row'];
export type ArticleInsert = Database['public']['Tables']['articles']['Insert'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Tag = Database['public']['Tables']['tags']['Row'];
export type Program = Database['public']['Tables']['programs']['Row'];
export type Report = Database['public']['Tables']['reports']['Row'];
export type Partner = Database['public']['Tables']['partners']['Row'];
export type GalleryItem = Database['public']['Tables']['gallery_items']['Row'];
export type TeamMember = Database['public']['Tables']['team_members']['Row'];
export type ContactSubmission = Database['public']['Tables']['contact_submissions']['Row'];
export type MembershipApplication = Database['public']['Tables']['membership_applications']['Row'];
export type NewsletterSubscriber = Database['public']['Tables']['newsletter_subscribers']['Row'];
export type Donation = Database['public']['Tables']['donations']['Row'];
export type SiteSetting = Database['public']['Tables']['site_settings']['Row'];
export type AdminProfile = Database['public']['Tables']['admin_profiles']['Row'];

export type AdminRole = 'super_admin' | 'admin' | 'editor' | 'viewer';
export type ArticleStatus = 'draft' | 'published';
export type SubmissionStatus = 'new' | 'read' | 'replied' | 'archived';
export type ApplicationStatus = 'pending' | 'under_review' | 'approved' | 'rejected';
