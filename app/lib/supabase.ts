import { createClient } from '@supabase/supabase-js';

// Initialize database client
const supabaseUrl = 'https://gbgnixtykemcwrpzmixj.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ijk4YzZhZTRhLTllZjQtNDQ4OS1iMWFmLThlNmUyM2JkNTBjNiJ9.eyJwcm9qZWN0SWQiOiJnYmduaXh0eWtlbWN3cnB6bWl4aiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzcwMDY3MjQ0LCJleHAiOjIwODU0MjcyNDQsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.E8fNPr92fasysA9yDTtpW9FZsxjb_pO-sRO8AHKeL7U';

const supabase = createClient(supabaseUrl, supabaseKey);

// Export URL and key for edge function calls
export { supabase, supabaseUrl, supabaseKey };
