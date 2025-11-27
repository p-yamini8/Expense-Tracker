
 const signupForm = document.getElementById('signup-form');
 signupForm.addEventListener('submit',async(e)=> {
      e.preventDefault();
      const payload = {
        name: document.getElementById('em_name').value,
        email: document.getElementById('em_signup').value,
        password: document.getElementById('pw_signup').value
      };
      const res = await fetch('/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result=await res.json();
     
      if (res.ok) {signupForm.reset(),
          window.location.href = '../login/login.html'

      }
    });
const showLogin=document.getElementById("show-login");
showLogin.addEventListener('click',e=>{
  e.preventDefault();
   window.location.href = '../login/login.html'
})