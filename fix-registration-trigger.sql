-- Create a trigger to automatically create champion profile when a user signs up
-- This bypasses RLS since it runs with definer privileges

-- First, create a function that creates the champion profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.champions (id, email, full_name, company, job_title, cla_accepted, nda_accepted)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'company', ''),
        COALESCE(NEW.raw_user_meta_data->>'job_title', ''),
        COALESCE((NEW.raw_user_meta_data->>'cla_accepted')::boolean, false),
        COALESCE((NEW.raw_user_meta_data->>'nda_accepted')::boolean, false)
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, champions.full_name),
        company = COALESCE(EXCLUDED.company, champions.company),
        job_title = COALESCE(EXCLUDED.job_title, champions.job_title);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT ALL ON public.champions TO supabase_auth_admin;

-- Also update the RLS policy to be more permissive for new inserts
-- Drop and recreate insert policy
DROP POLICY IF EXISTS "Users can insert own champion profile" ON champions;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON champions;

-- Create a more permissive insert policy
CREATE POLICY "Enable insert for authenticated users"
ON champions FOR INSERT
TO authenticated
WITH CHECK (true);

-- Verify
SELECT 'Trigger and policies created successfully!' as status;

