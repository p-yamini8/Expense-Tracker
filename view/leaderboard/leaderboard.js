
const back=document.getElementById('back');
 window.addEventListener('DOMContentLoaded', fetchuserExpenses)

 const expenseDiv = document.getElementById('expense-div');

async function fetchuserExpenses(e){
   e.preventDefault()

   let token = localStorage.getItem('token');
 
      

         const res = await fetch('/expense/premium-leaderboard', {
        headers: { Authorization: token }
      });
        const d = await res.json();
      if(res.ok)
      {
  console.table(d.data);
   
      }
    
    try{
       
    const response=await fetch('/expense/showleaderboard',{
        method:'GET',
      headers:{Authorization:token,
        "Content-Type":"application/json"}
    })
    const result=await response.json();
   if(response.ok)
   {
      const ol = document.createElement('ol');
      ol.classList.add('leaderboard-list');

      result.leaderboard.forEach((user, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <span class="rank">#${index + 1}</span>
          <span class="username">${user.name}</span>
          <span class="expense">₹${user.totalExpense}</span>
        `;
        li.classList.add('leaderboard-item');
        ol.appendChild(li);
      });

      expenseDiv.appendChild(ol);
    
   }
     else{
        console.log("error leader board display")
     } 
}
catch(error)
{
   console.log("not working leaderboard",error); 
}

      
 }
   

back.addEventListener('click',e=>{
    e.preventDefault();
    
 window.location.href='../expense/expense.html'
})