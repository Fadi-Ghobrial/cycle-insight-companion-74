
-- This SQL would be run to create the necessary database function
-- But we'll include it in the edge function folder for reference

CREATE OR REPLACE FUNCTION get_cycle_data_for_guardian(
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
  
  -- Sample query:
  /*
  SELECT jsonb_agg(
    jsonb_build_object(
      'date', cd.date,
      'flow', cd.flow,
      'symptoms', CASE WHEN include_symptoms THEN cd.symptoms ELSE NULL END,
      'notes', CASE WHEN include_notes THEN cd.notes ELSE NULL END
    )
  )
  FROM cycle_days cd
  WHERE cd.user_id = user_id_param
  AND cd.date >= NOW() - INTERVAL '90 days';
  */
  
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
