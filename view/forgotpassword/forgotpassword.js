 const forgotForm=document.getElementById("forgetPassword-form");
 forgotForm.addEventListener('submit',async(e)=>{
  e.preventDefault();
  alert('i forgot my password');
  const email= document.getElementById('email').value;
  const response=await fetch('/password/forgotpassword',{
   method:'POST',
    headers:{
      'Content-Type':'application/json'
    },body:JSON.stringify({email})
  })
  const result=await response.json();
  if(response.ok)
  {
    alert('Reset link is sent to your email')
console.log('result',result);
  }
  else{
    alert('failed to send reset link')
    console.log('error sending forgot password link');
  }
 })

const showLogin=document.getElementById("show-login");
showLogin.addEventListener('click',e=>{
  e.preventDefault();
   window.location.href = '../login/login.html'
})