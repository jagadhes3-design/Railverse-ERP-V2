(function(){
  const $=id=>document.getElementById(id);
  let client=null,loginBound=false;
  function message(s,isError=true){const el=$('loginMessage');if(el){el.textContent=s;el.className=isError?'error':'success';}}
  function unlock(session){
    if(!session?.user)return lock();
    document.body.classList.remove('rv-auth-pending');
    const who=$('rv-user-email');if(who)who.textContent=session.user.email||'Signed in';
    window.RV_AUTH_USER=session.user;
    window.dispatchEvent(new CustomEvent('rv-auth-ready',{detail:{user:session.user}}));
  }
  function lock(){
    document.body.classList.add('rv-auth-pending');
    window.RV_AUTH_USER=null;
    const who=$('rv-user-email');if(who)who.textContent='';
  }
  function bindLogin(){
    if(loginBound||!$('loginForm'))return;
    loginBound=true;
    $('loginForm').addEventListener('submit',async e=>{
      e.preventDefault();
      if(!client){message('Login service is not ready. Refresh and try again.');return;}
      const btn=$('loginSubmit');btn.disabled=true;btn.textContent='Signing in…';message('',false);
      try{
        const email=$('loginEmail').value.trim(),password=$('loginPassword').value;
        const {data,error}=await client.auth.signInWithPassword({email,password});
        if(error)throw error;
        unlock(data.session);
      }catch(err){message(err.message||'Sign in failed.');}
      finally{btn.disabled=false;btn.textContent='Sign in';}
    });
  }
  async function start(){
    lock();
    if(!window.supabase||!window.RV_SUPABASE_URL||!window.RV_SUPABASE_PUBLISHABLE_KEY){
      message('Secure login service could not load. Check your internet connection and refresh.');return;
    }
    client=window.supabase.createClient(window.RV_SUPABASE_URL,window.RV_SUPABASE_PUBLISHABLE_KEY,{
      auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}
    });
    window.RV_SUPABASE=client;
    bindLogin();
    client.auth.onAuthStateChange((event,session)=>{
      if(session)unlock(session);
      else if(event==='SIGNED_OUT')lock();
    });
    try{
      const {data,error}=await client.auth.getSession();
      if(error)throw error;
      if(data.session)unlock(data.session);
      else message('Sign in with your authorised Rail verse account.',false);
    }catch(err){message(err.message||'Could not check login session.');}
  }
  document.addEventListener('DOMContentLoaded',()=>{
    const out=$('rv-logout');
    if(out)out.addEventListener('click',async()=>{
      if(!client||!window.RV_AUTH_USER)return;
      if(!confirm('Sign out of Rail verse signalling works?'))return;
      const {error}=await client.auth.signOut();
      if(error){alert(error.message);return;}
      lock();message('You have been signed out.',false);$('loginPassword').value='';
    });
    start();
  });
})();