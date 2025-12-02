-- Temporarily disable RLS for profiles
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Re-enable with simpler policy
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create new policies
CREATE POLICY "Allow all operations for authenticated users" ON profiles
    FOR ALL USING (true) WITH CHECK (true);