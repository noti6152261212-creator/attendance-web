import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = 'https://vybskqcqiaihfyxijshj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5YnNrcWNxaWFpaGZ5eGlqc2hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MDMxOTMsImV4cCI6MjA5MTM3OTE5M30.vZnmRQtRAZbxGAYJEed1iLaQ9UUIdWT7qB6w4nP1CYk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkAdmin() {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    window.location.href = './admin-login.html';
    return;
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    await supabase.auth.signOut();
    window.location.href = './admin-login.html';
    return;
  }

  if (profile.role !== 'admin' && profile.role !== '管理者') {
    await supabase.auth.signOut();
    window.location.href = './admin-login.html';
    return;
  }

  console.log('管理者確認OK');
}

checkAdmin();