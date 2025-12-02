-- Fix RLS for evaluations table
DROP POLICY IF EXISTS "Service role can insert evaluations" ON evaluations;
DROP POLICY IF EXISTS "Service role can update evaluations" ON evaluations;

-- Allow API to insert evaluations
CREATE POLICY "Allow API to insert evaluations" ON evaluations
    FOR INSERT WITH CHECK (true);

-- Allow API to update evaluations  
CREATE POLICY "Allow API to update evaluations" ON evaluations
    FOR UPDATE USING (true);