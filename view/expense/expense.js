   const signupForm = document.getElementById('signup-form');
         const showSignup = document.getElementById('show-signup');
         const showLogin=document.getElementById("show-login");
        const  expensesDiv = document.getElementById('expenses');
        const aleaderboard=document.getElementById("show-leaderboard");
     const expenseForm=document.getElementById("exp-form")
  let editingExpenseId=null;
        aleaderboard.addEventListener('click',async(e)=>{
          e.preventDefault();
          window.location.href='../leaderboard/leaderboard.html'
        })
  
  const userSpan = document.getElementById('user');
const token=localStorage.getItem('token');
loadExpenses()

let currentPage=1;
       async function loadExpenses(page = 1) {
if(!token||token==undefined)
{
  window.location.href='../login/login.html'
}
var usertype = localStorage.getItem('user');
let name=localStorage.getItem('name')
if(usertype == "true")
{
userSpan.textContent=`${name}, Premium user`
}
else{
  userSpan.textContent=`${name} `
}
 
      const res = await fetch(`/expense/getexpenses?page=${page}&itemsPerPage=3`, {
        headers: { Authorization: token }
      });
      const r = await res.json();
      if(res.ok)
      { const tbody = document.querySelector('#daily-expense-table tbody');
  tbody.innerHTML = '';

  r.data.forEach(exp => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${new Date(exp.createdAt).toISOString().split('T')[0]}</td>
      <td>${exp.exp_amt}</td>
      <td>${exp.disc}</td>
      <td>${exp.ctg}</td>
      <td>${exp.note}</td>
    `;
      const btn = document.createElement('button');
        btn.textContent = 'Delete';
        btn.type="submit"
        btn.onclick = async () => {
          await fetch(`/expense/delete-expense/${exp.id}`, {
            method: 'DELETE',
            headers: { Authorization: token }
          });
          loadExpenses();
        };
       
        const editbtn=document.createElement('button');
        editbtn.textContent='Edit';
        editbtn.onclick=()=>{
        
          document.getElementById('exp_amt').value=exp.exp_amt;
           document.getElementById('disc').value=exp.disc;
            document.getElementById('ctg').value=exp.ctg;
            document.getElementById('note').value=exp.note;
           editingExpenseId=exp.id;
          // remove(exp.id);
            document.getElementById('add-expense-btn').textContent='Update Expense';
            
        }
        row.appendChild(btn);
        row.appendChild(editbtn);
    tbody.appendChild(row);
  });

  document.getElementById('page-info').textContent = `Page ${r.info.currentPage} of ${r.info.lastPage}`;

  // Disable buttons if needed
  document.getElementById('prev-btn').disabled = !r.info.hasPrev;
  document.getElementById('next-btn').disabled =!r.info.hasNext;
}
       }

// Event listeners
document.getElementById('prev-btn').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    loadExpenses(currentPage);
  }
});

document.getElementById('next-btn').addEventListener('click', () => {
  currentPage++;
  loadExpenses(currentPage);
});

// Load first page
loadExpenses(currentPage);
        
document.getElementById("add-expense-btn").onclick= async (event)=>
   {
    event.preventDefault()
    
     
           const token=localStorage.getItem('token')
     
    try{

        const amount = document.getElementById("exp_amt").value;
        
   if(!amount||isNaN(amount))
   {
    alert('please enter a valid amount');
    return;
   }
   const usertype = localStorage.getItem('user');
     ////
  if (editingExpenseId && usertype=='true') {
      // UPDATE existing expense
      await fetch(`/expense/update-expense/${editingExpenseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: token },
        body: JSON.stringify({
          exp_amt: +document.getElementById('exp_amt').value,
          disc: document.getElementById('disc').value,
          ctg: document.getElementById('ctg').value,
          note:  document.getElementById('note').value,
        })
      });

      editingExpenseId = null; // reset after update
      document.getElementById('add-expense-btn').textContent = 'Add Expense';
    }

     /////
  
  else if(usertype == "true" && !editingExpenseId)
   {alert('premium user')
    await fetch('/expense/add-expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: token },
        body: JSON.stringify({
          exp_amt: +document.getElementById('exp_amt').value,
          disc: document.getElementById('disc').value,
          ctg: document.getElementById('ctg').value,
           note: document.getElementById('note').value
        })
      });
      
           loadExpenses()
 document.getElementById('add-expense-btn').textContent='Add';
 expenseForm.reset()
   }
   else if(usertype=="false" && !editingExpenseId){
    alert('pay')
 const response = await fetch('/purchase/create-payment', {
              method: 'POST',
        headers: { 'Content-Type': 'application/json', "Authorization": token },
        body: JSON.stringify({amount})
        });
    
        const result = await response.json();
    
        if(result.paymentSessionId)
        {
          console.log("payment session",result)
    const cashfree=Cashfree({mode:"sandbox"});
    cashfree.checkout({
        paymentSessionId:result.paymentSessionId,
        redirectTarget:"_self",
     
});
 await fetch('/expense/add-expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: token },
        body: JSON.stringify({
          exp_amt: +document.getElementById('exp_amt').value,
          disc: document.getElementById('disc').value,
          ctg: document.getElementById('ctg').value,
            note:document.getElementById('note').value,
        })
      });
      
          
loadExpenses()
 document.getElementById('add-expense-btn').textContent='Add';
expenseForm.reset()
        }else{
          alert('failed to initiate payment');
        }
         }
          loadExpenses();
    expenseForm.reset();
  
   }
         catch(error)
    {
      alert(error);
      console.error('payment error',error)


    }
      
};
document.getElementById('download').onclick = function(e){
    
    let usertype = localStorage.getItem('user');
    console.log(usertype == "true")
    if(usertype == "true"){
        window.location.href = '../downloadreports/downloads.html'
    }
}

document.getElementById('logout').addEventListener('click',(e)=>{
  e.preventDefault();
    window.location.href = '../login/login.html'
})
