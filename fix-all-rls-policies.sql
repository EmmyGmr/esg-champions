-- =====================================================
-- COMPREHENSIVE RLS POLICY FIX
-- Run this in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- CHAMPIONS TABLE
-- =====================================================
DROP POLICY IF EXISTS "Users can insert own champion profile" ON champions;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON champions;
DROP POLICY IF EXISTS "Anyone can view champions" ON champions;
DROP POLICY IF EXISTS "Public can view champions" ON champions;
DROP POLICY IF EXISTS "Users can update own champion profile" ON champions;
DROP POLICY IF EXISTS "Users can delete own champion profile" ON champions;
DROP POLICY IF EXISTS "Champions can view own profile" ON champions;
DROP POLICY IF EXISTS "Champions can update own profile" ON champions;

-- Allow anyone to view champions (for leaderboard)
CREATE POLICY "Anyone can view champions"
ON champions FOR SELECT
USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Authenticated can insert champions"
ON champions FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON champions FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- =====================================================
-- REVIEWS TABLE
-- =====================================================
DROP POLICY IF EXISTS "Champions can view own reviews" ON reviews;
DROP POLICY IF EXISTS "Champions can insert reviews" ON reviews;
DROP POLICY IF EXISTS "Champions can update own reviews" ON reviews;
DROP POLICY IF EXISTS "Admins can view all reviews" ON reviews;
DROP POLICY IF EXISTS "Admins can update reviews" ON reviews;
DROP POLICY IF EXISTS "Anyone can view reviews" ON reviews;

-- Anyone can view reviews
CREATE POLICY "Anyone can view reviews"
ON reviews FOR SELECT
USING (true);

-- Authenticated users can insert reviews
CREATE POLICY "Authenticated can insert reviews"
ON reviews FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = champion_id);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
ON reviews FOR UPDATE
TO authenticated
USING (auth.uid() = champion_id);

-- =====================================================
-- ACCEPTED_REVIEWS TABLE
-- =====================================================
DROP POLICY IF EXISTS "Anyone can view accepted reviews" ON accepted_reviews;
DROP POLICY IF EXISTS "Admins can manage accepted reviews" ON accepted_reviews;

-- Anyone can view accepted reviews
CREATE POLICY "Anyone can view accepted reviews"
ON accepted_reviews FOR SELECT
USING (true);

-- Authenticated can insert accepted reviews (admin check in app)
CREATE POLICY "Authenticated can insert accepted reviews"
ON accepted_reviews FOR INSERT
TO authenticated
WITH CHECK (true);

-- =====================================================
-- PANELS TABLE
-- =====================================================
DROP POLICY IF EXISTS "Anyone can view panels" ON panels;

CREATE POLICY "Anyone can view panels"
ON panels FOR SELECT
USING (true);

-- =====================================================
-- INDICATORS TABLE
-- =====================================================
DROP POLICY IF EXISTS "Anyone can view indicators" ON indicators;

CREATE POLICY "Anyone can view indicators"
ON indicators FOR SELECT
USING (true);

-- =====================================================
-- VOTES TABLE
-- =====================================================
DROP POLICY IF EXISTS "Anyone can view votes" ON votes;
DROP POLICY IF EXISTS "Champions can insert votes" ON votes;
DROP POLICY IF EXISTS "Champions can update own votes" ON votes;

-- Anyone can view votes
CREATE POLICY "Anyone can view votes"
ON votes FOR SELECT
USING (true);

-- Authenticated can vote
CREATE POLICY "Authenticated can insert votes"
ON votes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = champion_id);

-- Users can update their own votes
CREATE POLICY "Users can update own votes"
ON votes FOR UPDATE
TO authenticated
USING (auth.uid() = champion_id);

-- =====================================================
-- COMMENTS TABLE
-- =====================================================
DROP POLICY IF EXISTS "Anyone can view comments" ON comments;
DROP POLICY IF EXISTS "Champions can insert comments" ON comments;
DROP POLICY IF EXISTS "Champions can update own comments" ON comments;

-- Anyone can view comments
CREATE POLICY "Anyone can view comments"
ON comments FOR SELECT
USING (true);

-- Authenticated can comment
CREATE POLICY "Authenticated can insert comments"
ON comments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = champion_id);

-- =====================================================
-- NOTIFICATIONS TABLE
-- =====================================================
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "System can insert notifications" ON notifications;

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
ON notifications FOR SELECT
TO authenticated
USING (auth.uid() = champion_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
ON notifications FOR UPDATE
TO authenticated
USING (auth.uid() = champion_id);

-- Allow insert for notifications (system/admin creates these)
CREATE POLICY "Authenticated can insert notifications"
ON notifications FOR INSERT
TO authenticated
WITH CHECK (true);

-- =====================================================
-- CHAMPION_ACTIVITY TABLE (if exists)
-- =====================================================
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'champion_activity') THEN
        DROP POLICY IF EXISTS "Users can view own activity" ON champion_activity;
        DROP POLICY IF EXISTS "Users can insert own activity" ON champion_activity;
        
        CREATE POLICY "Users can view own activity"
        ON champion_activity FOR SELECT
        TO authenticated
        USING (auth.uid() = champion_id);
        
        CREATE POLICY "Users can insert own activity"
        ON champion_activity FOR INSERT
        TO authenticated
        WITH CHECK (auth.uid() = champion_id);
    END IF;
END $$;

-- =====================================================
-- VERIFY
-- =====================================================
SELECT 'RLS policies updated successfully!' as status;

SELECT tablename, policyname, permissive, cmd 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, cmd;

