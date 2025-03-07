/*
  # Create playgrounds table

  1. New Tables
    - `playgrounds`
      - `id` (integer, primary key)
      - `created_at` (timestamp with time zone)
      - `name` (text, not null)
      - `description` (text, not null)
      - `address` (text, not null)
      - `city` (text, not null)
      - `postcode` (text, not null)
      - `phone` (text)
      - `email` (text)
      - `website` (text)
      - `google_rating` (numeric)
      - `google_reviews_count` (integer)
      - `latitude` (numeric)
      - `longitude` (numeric)
      - `features` (text array)
      - `price_range` (text)
      - `age_range` (text)
      - `opening_hours` (jsonb)
      - `image_url` (text)
  
  2. Security
    - Enable RLS on `playgrounds` table
    - Add policy for authenticated users to read all playgrounds
    - Add policy for authenticated users to insert their own playgrounds
    - Add policy for authenticated users to update their own playgrounds
*/

-- Create the playgrounds table
CREATE TABLE IF NOT EXISTS playgrounds (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  postcode TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  website TEXT,
  google_rating NUMERIC,
  google_reviews_count INTEGER,
  latitude NUMERIC,
  longitude NUMERIC,
  features TEXT[],
  price_range TEXT,
  age_range TEXT,
  opening_hours JSONB,
  image_url TEXT
);

-- Enable Row Level Security
ALTER TABLE playgrounds ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DO $$
BEGIN
    -- Check if the policy exists before attempting to drop it
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'playgrounds' AND policyname = 'Anyone can read playgrounds'
    ) THEN
        DROP POLICY "Anyone can read playgrounds" ON playgrounds;
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'playgrounds' AND policyname = 'Authenticated users can insert their own playgrounds'
    ) THEN
        DROP POLICY "Authenticated users can insert their own playgrounds" ON playgrounds;
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'playgrounds' AND policyname = 'Authenticated users can update their own playgrounds'
    ) THEN
        DROP POLICY "Authenticated users can update their own playgrounds" ON playgrounds;
    END IF;
END
$$;

-- Create policies
-- Allow anyone to read all playgrounds
CREATE POLICY "Anyone can read playgrounds"
  ON playgrounds
  FOR SELECT
  USING (true);

-- Allow authenticated users to insert their own playgrounds
CREATE POLICY "Authenticated users can insert their own playgrounds"
  ON playgrounds
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update their own playgrounds
-- In a real app, you'd want to add a user_id column and check against auth.uid()
CREATE POLICY "Authenticated users can update their own playgrounds"
  ON playgrounds
  FOR UPDATE
  TO authenticated
  USING (true);

-- Insert sample data
INSERT INTO playgrounds (
  name, 
  description, 
  address, 
  city, 
  postcode, 
  phone, 
  email, 
  website, 
  google_rating, 
  google_reviews_count, 
  latitude, 
  longitude, 
  features, 
  price_range, 
  age_range, 
  opening_hours, 
  image_url
) VALUES 
(
  'Funky Monkeys Play Centre',
  'Funky Monkeys is a vibrant indoor play centre designed for children aged 0-12. Our facility features a large multi-level soft play structure with slides, ball pits, and climbing frames. We also have a dedicated toddler area for the little ones, party rooms for birthdays, and a café where parents can relax while keeping an eye on their children.',
  '123 Play Street',
  'London',
  'E1 6AN',
  '020 1234 5678',
  'info@funkymonkeys.com',
  'https://www.funkymonkeys.com',
  4.7,
  342,
  51.5173,
  -0.0755,
  ARRAY['Soft Play', 'Ball Pit', 'Café', 'Party Rooms', 'Toddler Area'],
  '££',
  '0-12',
  '{"Monday": "9:00-18:00", "Tuesday": "9:00-18:00", "Wednesday": "9:00-18:00", "Thursday": "9:00-18:00", "Friday": "9:00-19:00", "Saturday": "9:00-19:00", "Sunday": "10:00-18:00"}',
  'https://images.unsplash.com/photo-1566454825481-9c31bd88c36f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
),
(
  'Adventure World',
  'Adventure World is an exciting indoor playground featuring a range of activities for children of all ages. Our main play area includes climbing walls, tube slides, and obstacle courses. We also offer a separate area for toddlers, a gaming zone for older kids, and a café serving hot and cold food and drinks.',
  '45 Adventure Lane',
  'Manchester',
  'M4 1HQ',
  '0161 987 6543',
  'hello@adventureworld.co.uk',
  'https://www.adventureworld.co.uk',
  4.5,
  287,
  53.4808,
  -2.2426,
  ARRAY['Climbing Walls', 'Slides', 'Gaming Zone', 'Café', 'Toddler Area'],
  '££',
  '0-14',
  '{"Monday": "10:00-18:00", "Tuesday": "10:00-18:00", "Wednesday": "10:00-18:00", "Thursday": "10:00-18:00", "Friday": "10:00-20:00", "Saturday": "9:00-20:00", "Sunday": "10:00-18:00"}',
  'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
),
(
  'Jungle Jims',
  'Jungle Jims is a jungle-themed indoor play centre that offers a safe and fun environment for children to play and explore. Our facility includes a large play frame with slides, rope bridges, and ball cannons. We also have a dedicated area for under 5s, party rooms for special occasions, and a café serving a variety of refreshments.',
  '78 Jungle Road',
  'Birmingham',
  'B2 5DP',
  '0121 345 6789',
  'enquiries@junglejims.com',
  'https://www.junglejims.com',
  4.3,
  198,
  52.4862,
  -1.8904,
  ARRAY['Soft Play', 'Ball Cannons', 'Rope Bridges', 'Café', 'Party Rooms', 'Under 5s Area'],
  '£',
  '0-10',
  '{"Monday": "9:30-17:30", "Tuesday": "9:30-17:30", "Wednesday": "9:30-17:30", "Thursday": "9:30-17:30", "Friday": "9:30-18:30", "Saturday": "9:00-18:30", "Sunday": "10:00-17:30"}',
  'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
),
(
  'Tiny Town Play Centre',
  'Tiny Town is a unique indoor play centre designed as a miniature town where children can engage in role play. Our facility features a mini supermarket, hospital, fire station, and more, allowing children to explore different professions through play. We also have a small soft play area and a café for parents.',
  '12 Little Lane',
  'Edinburgh',
  'EH1 1TT',
  '0131 234 5678',
  'play@tinytown.co.uk',
  'https://www.tinytown.co.uk',
  4.8,
  156,
  55.9533,
  -3.1883,
  ARRAY['Role Play', 'Soft Play', 'Café', 'Party Packages', 'Accessible'],
  '££',
  '2-8',
  '{"Monday": "9:00-17:00", "Tuesday": "9:00-17:00", "Wednesday": "9:00-17:00", "Thursday": "9:00-17:00", "Friday": "9:00-17:00", "Saturday": "9:00-18:00", "Sunday": "10:00-17:00"}',
  'https://images.unsplash.com/photo-1566454825481-9c31bd88c36f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
),
(
  'Bounce & Play',
  'Bounce & Play is an indoor playground featuring a variety of inflatable bouncy castles, slides, and obstacle courses. We also have a dedicated toddler area with smaller inflatables, a café serving snacks and drinks, and party packages for birthdays and special events.',
  '56 Bounce Street',
  'Glasgow',
  'G1 2BP',
  '0141 876 5432',
  'info@bounceandplay.co.uk',
  'https://www.bounceandplay.co.uk',
  4.2,
  178,
  55.8642,
  -4.2518,
  ARRAY['Bouncy Castles', 'Inflatable Slides', 'Obstacle Courses', 'Toddler Area', 'Café', 'Party Packages'],
  '£',
  '1-12',
  '{"Monday": "10:00-18:00", "Tuesday": "10:00-18:00", "Wednesday": "10:00-18:00", "Thursday": "10:00-18:00", "Friday": "10:00-19:00", "Saturday": "9:00-19:00", "Sunday": "10:00-18:00"}',
  'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
),
(
  'Kids Kingdom',
  'Kids Kingdom is a large indoor play centre with something for everyone. Our main play area features slides, ball pits, and climbing frames, while our sports zone offers football and basketball. We also have a dedicated area for under 3s, party rooms, and a café serving hot and cold food.',
  '89 Kingdom Way',
  'Leeds',
  'LS1 4DK',
  '0113 987 6543',
  'hello@kidskingdom.co.uk',
  'https://www.kidskingdom.co.uk',
  4.6,
  265,
  53.7967,
  -1.5477,
  ARRAY['Soft Play', 'Sports Zone', 'Ball Pits', 'Under 3s Area', 'Café', 'Party Rooms'],
  '££',
  '0-12',
  '{"Monday": "9:30-18:00", "Tuesday": "9:30-18:00", "Wednesday": "9:30-18:00", "Thursday": "9:30-18:00", "Friday": "9:30-19:00", "Saturday": "9:00-19:00", "Sunday": "10:00-18:00"}',
  'https://images.unsplash.com/photo-1566454825481-9c31bd88c36f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
);