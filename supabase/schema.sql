-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- NOTE: JWT secret should be set through the Supabase dashboard under Settings > API
-- Don't set it directly in SQL as it requires superuser privileges
-- ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-secret-key';

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  image TEXT,
  average_cycle_length INTEGER DEFAULT 28,
  last_period_start DATE,
  pregnancy_mode BOOLEAN DEFAULT FALSE,
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Periods Table
CREATE TABLE IF NOT EXISTS periods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE,
  flow_level TEXT CHECK (flow_level IN ('light', 'medium', 'heavy')),
  flow_intensity TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Symptoms Table
CREATE TABLE IF NOT EXISTS symptoms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  type TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('mild', 'moderate', 'severe')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Mood Tracking Table
CREATE TABLE IF NOT EXISTS moods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  mood TEXT CHECK (mood IN ('happy', 'sad', 'stressed', 'energetic', 'tired', 'irritable', 'calm', 'anxious')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Pregnancy Tracking Table
CREATE TABLE IF NOT EXISTS pregnancy (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  due_date DATE NOT NULL,
  conception_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Pregnancy Checkpoints
CREATE TABLE IF NOT EXISTS pregnancy_checkpoints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pregnancy_id UUID REFERENCES pregnancy(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  date DATE NOT NULL,
  weight DECIMAL(5,2),
  blood_pressure TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Health Metrics
CREATE TABLE IF NOT EXISTS health_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  weight DECIMAL(5,2),
  temperature DECIMAL(3,1),
  sleep_hours DECIMAL(3,1),
  water_intake INTEGER, -- in ml
  exercise_minutes INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User Settings
CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  notification_enabled BOOLEAN DEFAULT TRUE,
  period_reminder_days INTEGER DEFAULT 2,
  ovulation_reminder BOOLEAN DEFAULT TRUE,
  theme TEXT DEFAULT 'light',
  data_sharing BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Articles and Health Info
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  author TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE pregnancy ENABLE ROW LEVEL SECURITY;
ALTER TABLE pregnancy_checkpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Users policies
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow service role to manage users (needed for authentication)
CREATE POLICY "Service role can manage users" ON users
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Create a policy to enable inserting users during signup
CREATE POLICY "Allow public insertion of users during signup" ON users
  FOR INSERT WITH CHECK (true);

-- Periods policies
CREATE POLICY "Users can view their own periods" ON periods
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert their own periods" ON periods
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own periods" ON periods
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete their own periods" ON periods
  FOR DELETE USING (auth.uid() = user_id);

-- Symptoms policies
CREATE POLICY "Users can view their own symptoms" ON symptoms
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert their own symptoms" ON symptoms
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own symptoms" ON symptoms
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete their own symptoms" ON symptoms
  FOR DELETE USING (auth.uid() = user_id);

-- Moods policies
CREATE POLICY "Users can view their own moods" ON moods
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert their own moods" ON moods
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own moods" ON moods
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete their own moods" ON moods
  FOR DELETE USING (auth.uid() = user_id);

-- Health metrics policies
CREATE POLICY "Users can view their own health metrics" ON health_metrics
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert their own health metrics" ON health_metrics
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own health metrics" ON health_metrics
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete their own health metrics" ON health_metrics
  FOR DELETE USING (auth.uid() = user_id);

-- User settings policies
CREATE POLICY "Users can view their own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- Articles policies (public readable)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view articles" ON articles
  FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX periods_user_id_idx ON periods(user_id);
CREATE INDEX periods_start_date_idx ON periods(start_date);
CREATE INDEX symptoms_user_id_idx ON symptoms(user_id);
CREATE INDEX symptoms_date_idx ON symptoms(date);
CREATE INDEX moods_user_id_idx ON moods(user_id);
CREATE INDEX health_metrics_user_id_idx ON health_metrics(user_id);
CREATE INDEX health_metrics_date_idx ON health_metrics(date);

-- Insert some sample health articles
INSERT INTO articles (title, content, category, author) VALUES
('Understanding Your Menstrual Cycle', 'Your menstrual cycle is regulated by hormones produced by the hypothalamus, pituitary gland, and ovaries. The cycle begins with menstruation (your period), followed by the follicular phase, ovulation, and finally the luteal phase before the cycle begins again...', 'Education', 'Dr. Emily Johnson'),
('Signs of Ovulation', 'Understanding when you ovulate is key to either achieving or avoiding pregnancy. Common signs include changes in cervical mucus, a slight rise in basal body temperature, and sometimes mild pain on one side of your lower abdomen...', 'Fertility', 'Dr. Michael Chen'),
('Managing Period Pain Naturally', 'Many people experience discomfort during their periods. Natural remedies include applying heat to your abdomen, staying hydrated, getting regular exercise, and incorporating anti-inflammatory foods into your diet...', 'Health', 'Sarah Williams, RN'),
('Nutrition and Your Cycle', 'Your nutritional needs change throughout your menstrual cycle. During menstruation, focus on iron-rich foods. In the follicular phase, emphasize proteins and antioxidants. Around ovulation, eat foods with zinc and magnesium. During the luteal phase, focus on foods with B vitamins and calcium...', 'Wellness', 'Jessica Martinez, RD');

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER set_timestamp_users
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_periods
BEFORE UPDATE ON periods
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_symptoms
BEFORE UPDATE ON symptoms
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_pregnancy
BEFORE UPDATE ON pregnancy
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_user_settings
BEFORE UPDATE ON user_settings
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp(); 