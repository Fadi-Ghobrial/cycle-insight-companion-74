
-- Create table for guardian share settings if it doesn't exist
CREATE TABLE IF NOT EXISTS public.guardian_share_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  enabled BOOLEAN DEFAULT false,
  consent_verified BOOLEAN DEFAULT false,
  passcode TEXT,
  guardian_email TEXT,
  last_export_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.guardian_share_settings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to manage their own settings
CREATE POLICY IF NOT EXISTS "Users can manage their own guardian share settings"
  ON public.guardian_share_settings
  FOR ALL
  USING (auth.uid() = user_id);

-- Create function to get cycle data for guardian report
-- This would be replaced with your actual implementation
CREATE OR REPLACE FUNCTION public.get_cycle_data_for_guardian(
  user_id_param UUID,
  include_symptoms BOOLEAN DEFAULT true,
  include_cycle_dates BOOLEAN DEFAULT true,
  include_notes BOOLEAN DEFAULT false
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
BEGIN
  -- This is a simplified example
  -- In a real implementation, you would query your cycle_days table
  -- and format the data appropriately
  
  -- For demo purposes, return sample data
  result := '[
    {
      "date": "2023-04-01",
      "flow": "medium",
      "symptoms": ["cramps", "bloating"],
      "notes": "Feeling tired today"
    },
    {
      "date": "2023-04-02",
      "flow": "light",
      "symptoms": ["cramps"],
      "notes": "Better than yesterday"
    },
    {
      "date": "2023-04-03",
      "flow": "light",
      "symptoms": [],
      "notes": null
    },
    {
      "date": "2023-04-04",
      "flow": "none",
      "symptoms": [],
      "notes": null
    }
  ]'::jsonb;
  
  RETURN result;
END;
$$;
