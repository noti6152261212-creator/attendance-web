import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = 'https://vybskqcqiaihfyxijshj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5YnNrcWNxaWFpaGZ5eGlqc2hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MDMxOTMsImV4cCI6MjA5MTM3OTE5M30.vZnmRQtRAZbxGAYJEed1iLaQ9UUIdWT7qB6w4nP1CYk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const loginBtn = document.getElementById('loginBtn');
const message = document.getElementById('message');

loginBtn.addEventListener('click', async () => {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  message.textContent = '';

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    message.textContent = `ログイン失敗: ${error.message}`;
    console.error(error);
    return;
  }

  const user = data.user;

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError) {
    message.textContent = 'プロフィール取得エラー';
    console.error(profileError);
    return;
  }

  if (profile.role !== 'admin' && profile.role !== '管理者') {
    message.textContent = '管理者ではありません';
    await supabase.auth.signOut();
    return;
  }

  window.location.href = './index.html';
});