

 const loginForm = document.getElementById('login-form');
  const showSignup = document.getElementById('show-signup');
 const userSpan = document.getElementById('user');
  const signupForm = document.getElementById('signup-form');
      
         const showLogin=document.getElementById('show-login');
        const  expensesDiv = document.getElementById('expenses');
        
        const  expenselistdiv = document.getElementById('expense-list');
   loginForm.addEventListener('submit',async (e)=> {
      e.preventDefault();
     
      const res = await fetch('/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: document.getElementById('em_login').value,
          password: document.getElementById('pw_login').value
        })
      });
      const data = await res.json();
      alert(data.message);
    
      if (res.ok) {
         
        token = data.token;
        console.log('token from server',token)
        localStorage.setItem('token',data.token)
        localStorage.setItem('user',data.ispremiumuser)
        localStorage.setItem('name',data.name)
       
        window.location.href = "../expense/expense.html";
       
      }
    });

