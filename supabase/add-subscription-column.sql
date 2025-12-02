-- Add subscription_plan column to profiles table if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'Free' CHECK (subscription_plan IN ('Free', 'Premium', 'Ultra Premium'));

-- Update existing profiles to have Free plan
UPDATE profiles SET subscription_plan = 'Free' WHERE subscription_plan IS NULL;