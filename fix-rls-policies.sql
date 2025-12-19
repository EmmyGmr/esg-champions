-- Fix RLS policies for champions table to allow registration

-- Drop existing policies that might be blocking
DROP POLICY IF EXISTS "Champions can insert own profile" ON champions;
DROP POLICY IF EXISTS "Champions can view own profile" ON champions;
DROP POLICY IF EXISTS "Champions can update own profile" ON champions;
DROP POLICY IF EXISTS "Anyone can view champions" ON champions;
DROP POLICY IF EXISTS "Users can insert own champion profile" ON champions;

-- Create new, permissive policies

-- Allow authenticated users to insert their own profile
CREATE POLICY "Users can insert own champion profile"
ON champions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Allow users to view all champions (for leaderboard, etc.)
CREATE POLICY "Anyone can view champions"
ON champions FOR SELECT
TO authenticated
USING (true);

-- Allow public to view champions (for public leaderboard)
CREATE POLICY "Public can view champions"
ON champions FOR SELECT
TO anon
USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update own champion profile"
ON champions FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow users to delete their own profile
CREATE POLICY "Users can delete own champion profile"
ON champions FOR DELETE
TO authenticated
USING (auth.uid() = id);

-- Verify policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE tablename = 'champions';

