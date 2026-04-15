import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = 'あなたのSupabase URL';
const supabaseAnonKey = 'あなたのSupabase anon key';

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

  window.location.href = './admin.html';
});