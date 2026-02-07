
-- 1. Index for efficient sorting and filtering by listing
CREATE INDEX IF NOT EXISTS idx_listing_media_listing_sort 
ON listing_media(listing_id, sort_order);

-- 2. Partial unique index to ensure only ONE cover image per listing
-- This prevents multiple rows having is_cover = true for the same listing_id
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_cover_per_listing 
ON listing_media(listing_id) 
WHERE (is_cover = true);

-- 3. Safety constraint: Ensure media_type is valid (optional but good practice)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_media_type') THEN
        ALTER TABLE listing_media
        ADD CONSTRAINT check_media_type CHECK (media_type IN ('image', 'video'));
    END IF;
END $$;

-- 4. Enable Row Level Security (RLS) if not already enabled
ALTER TABLE listing_media ENABLE ROW LEVEL SECURITY;

-- 5. Policies (adjust as needed based on your auth model)
-- Allow public read access
CREATE POLICY "Public media access" 
ON listing_media FOR SELECT 
USING (true);

-- Allow authenticated users (admin) to insert/update/delete
-- Assuming using service role key bypasses this, but good to have if you switch to user auth
CREATE POLICY "Admin full access" 
ON listing_media FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
