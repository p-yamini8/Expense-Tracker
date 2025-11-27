

let token = localStorage.getItem('token');
let list = document.getElementById('list-div');
let listno = 0 ;

window.addEventListener('DOMContentLoaded' , async(e)=>{
    e.preventDefault()
    try {
        let response = await fetch('/expense/getAllDownloadUrl' , 
            {method:'GET',
                headers: {Authorization: token}})
        if(response.status === 200){
            let data=await response.json();
            showUrls(data)
        }
    } catch (error) {

        response.status(500).json({'message':'error getting expensees'})
    }
})

document.getElementById('download').onclick = async function(e){
    e.preventDefault()
    try {
        let response = await fetch('/expense/download', {headers: {Authorization: token}})
        if(response.status === 200){
            const data=await response.json();
            showUrlOnscreen(data.downloadUrlData); 
            var a = document.createElement('a');
            a.href =`${data.fileURL}`;
            a.download = 'userExpense.csv';
            a.click();
        }
    } catch (err) {
        console.log(err)
    }
}

function showUrlOnscreen(data){
    alert('show')
    let  child = `<li class="list" >
        <a href="${data.fileUrl}" class="expense-info">${listno + 1}. ${data.fileName}</a>
    </li>`  

    list.innerHTML += child
}

function showUrls(data){
    alert('showing')
    
    list.innerHTML = ''
    data.urls.forEach(url => {
        let  child = `<li class="list" >
        <a href="${url.fileUrl}" class="expense-info">${listno + 1}. ${url.fileName}</a>
    </li>`  

    list.innerHTML += child

    listno++
    });
}

document.getElementById('home').onclick = function(e){
    window.location.href = '../expense/expense.html'
}