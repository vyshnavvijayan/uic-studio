-- ============================================================================
-- UIC STUDIO — SUPABASE SCHEMA & SECURITY MIGRATION
-- Tables: site_admins, site_content, site_revisions
-- Storage Bucket: site-media
-- Security: Row Level Security, Admin Checks, Transactional Publishing
-- ============================================================================

-- 1. SITE ADMINS TABLE
-- Stores explicitly approved user IDs that have administrative rights.
-- Users CANNOT insert themselves into this table.
CREATE TABLE IF NOT EXISTS public.site_admins (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.site_admins ENABLE ROW LEVEL SECURITY;

-- Security Definer function to check if the current caller is an approved admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.site_admins
    WHERE id = auth.uid()
  );
$$;

-- RLS for site_admins:
-- Only existing admins can read the list of admins.
-- No user can insert, update, or delete admins through public API unless done by superadmin or direct DB console.
CREATE POLICY "Admins can view site_admins"
    ON public.site_admins
    FOR SELECT
    TO authenticated
    USING (public.is_admin());

-- 2. SITE CONTENT TABLE
-- Stores draft and published JSON documents.
-- id = 'published' (accessible to public)
-- id = 'draft' (admin-only)
CREATE TABLE IF NOT EXISTS public.site_content (
    id TEXT PRIMARY KEY CHECK (id IN ('published', 'draft')),
    content JSONB NOT NULL,
    revision INTEGER NOT NULL DEFAULT 1,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Public can ONLY read the 'published' content row
CREATE POLICY "Public can read published site_content"
    ON public.site_content
    FOR SELECT
    TO anon, authenticated
    USING (id = 'published');

-- Only verified admins can read 'draft' content
CREATE POLICY "Admins can read draft site_content"
    ON public.site_content
    FOR SELECT
    TO authenticated
    USING (public.is_admin());

-- Only verified admins can insert/update draft or published content
CREATE POLICY "Admins can update site_content"
    ON public.site_content
    FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 3. SITE REVISIONS TABLE
-- Stores historical snapshots of published content for auditing and rollback.
CREATE TABLE IF NOT EXISTS public.site_revisions (
    id BIGSERIAL PRIMARY KEY,
    revision INTEGER NOT NULL,
    content JSONB NOT NULL,
    notes TEXT,
    published_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    published_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.site_revisions ENABLE ROW LEVEL SECURITY;

-- Only verified admins can view revisions
CREATE POLICY "Admins can view site_revisions"
    ON public.site_revisions
    FOR SELECT
    TO authenticated
    USING (public.is_admin());

-- Only verified admins can insert revisions
CREATE POLICY "Admins can insert site_revisions"
    ON public.site_revisions
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

-- 4. TRANSACTIONAL PUBLISHING STORED PROCEDURE
-- Publishes draft content atomically to 'published', increments revision,
-- prevents race conditions via optimistic concurrency checking, and logs to site_revisions.
CREATE OR REPLACE FUNCTION public.publish_site_content(
    p_content JSONB,
    p_expected_revision INTEGER DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_current_rev INTEGER := 0;
    v_new_rev INTEGER := 1;
    v_user_id UUID;
    v_result JSONB;
BEGIN
    -- 1. Check authorization
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: Only approved admins may publish content.';
    END IF;

    v_user_id := auth.uid();

    -- 2. Validate current revision to prevent overwrite collision
    SELECT revision INTO v_current_rev
    FROM public.site_content
    WHERE id = 'published';

    IF v_current_rev IS NOT NULL THEN
        IF p_expected_revision IS NOT NULL AND p_expected_revision != v_current_rev THEN
            RAISE EXCEPTION 'Revision Conflict: Current published revision is %, but editor expected %. Please reload latest changes before publishing.', v_current_rev, p_expected_revision;
        END IF;
        v_new_rev := v_current_rev + 1;
    ELSE
        v_new_rev := 1;
    END IF;

    -- 3. Update or Insert 'published' row
    INSERT INTO public.site_content (id, content, revision, updated_at, updated_by)
    VALUES ('published', p_content, v_new_rev, timezone('utc'::text, now()), v_user_id)
    ON CONFLICT (id) DO UPDATE
    SET content = EXCLUDED.content,
        revision = v_new_rev,
        updated_at = timezone('utc'::text, now()),
        updated_by = v_user_id;

    -- 4. Also keep 'draft' in sync with newly published version
    INSERT INTO public.site_content (id, content, revision, updated_at, updated_by)
    VALUES ('draft', p_content, v_new_rev, timezone('utc'::text, now()), v_user_id)
    ON CONFLICT (id) DO UPDATE
    SET content = EXCLUDED.content,
        revision = v_new_rev,
        updated_at = timezone('utc'::text, now()),
        updated_by = v_user_id;

    -- 5. Record snapshot in site_revisions
    INSERT INTO public.site_revisions (revision, content, notes, published_at, published_by)
    VALUES (v_new_rev, p_content, COALESCE(p_notes, 'Published via UIC Studio CMS'), timezone('utc'::text, now()), v_user_id);

    v_result := jsonb_build_object(
        'success', true,
        'revision', v_new_rev,
        'published_at', timezone('utc'::text, now())
    );

    RETURN v_result;
END;
$$;

-- 5. STORAGE BUCKET CONFIGURATION FOR SITE-MEDIA
-- Create 'site-media' bucket if it doesn't already exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'site-media',
    'site-media',
    true,
    25165824, -- 24MB maximum
    ARRAY[
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
        'video/mp4',
        'video/webm'
    ]
)
ON CONFLICT (id) DO UPDATE
SET public = true,
    file_size_limit = 25165824,
    allowed_mime_types = ARRAY[
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
        'video/mp4',
        'video/webm'
    ];

-- Storage Policies for 'site-media':
-- Anyone can view media files publicly
CREATE POLICY "Public media access"
    ON storage.objects
    FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'site-media');

-- Only approved admins can upload/insert media
CREATE POLICY "Admin media upload"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'site-media'
        AND public.is_admin()
        -- Extra security: ensure no executable or SVG uploads
        AND (storage.extension(name) IN ('jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4', 'webm'))
    );

-- Only approved admins can update media
CREATE POLICY "Admin media update"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'site-media' AND public.is_admin())
    WITH CHECK (bucket_id = 'site-media' AND public.is_admin());

-- Only approved admins can delete media
CREATE POLICY "Admin media delete"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'site-media' AND public.is_admin());

-- 6. INITIAL ADMIN PROVISIONING HELPER
-- Run this block once with your target admin email after creating their auth user
-- Example:
-- INSERT INTO public.site_admins (id, email, role)
-- SELECT id, email, 'admin'
-- FROM auth.users
-- WHERE email = 'admin@uic.studio'
-- ON CONFLICT (id) DO NOTHING;
