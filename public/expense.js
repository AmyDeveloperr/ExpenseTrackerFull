
function saveToStorage(event)
{
    event.preventDefault();
    const eamount = event.target.eamount.value;
    const edescription = event.target.edescription.value;
    const category = event.target.category.value;
    const token = localStorage.getItem('token');
    
    const obj = {
        eamount,
        edescription,
        category,
        
    }

    
        axios.post("http://35.77.84.60:5000/user/addExpense",obj, {headers: {"Authorization": token}}).then((response)=>{
            console.log(response);
            
            showListofRegisteredExpenses(response.data.newExpenseDetail)

        }).catch((err)=>{
        console.log(err);
    })
        
    //clear inout fields
    document.getElementById('ed').value = ''; 
    document.getElementById('ea').value = '';
    document.getElementById('cl').value = '';


}

function showListofRegisteredExpenses(user)
{
    const parentNode = document.getElementById('listOfExpenses'); 
    const createNewUserHtml = `<li id=${user.id}>${user.eamount} - ${user.edescription} -${user.category} 
                                    <button onclick="deleteUser('${user.id}')">Delete</button>
                                    <button onclick="editUser('${user.id}','${user.edescription}','${user.eamount}','${user.category}')">Edit</button>
                                   
                                 </li>
                                `


    parentNode.innerHTML += createNewUserHtml;

    document.getElementById('ed').value = ''; 
    document.getElementById('ea').value = '';
    document.getElementById('cl').value = '';

}








window.addEventListener('DOMContentLoaded', async(event) =>{
   // event.preventDefault();

   let Items_Per_Page = +document.getElementById('Items_Per_Page')

  // Items_Per_Page = +event.target.Items_Per_Page.value;    ${page}
    const token = localStorage.getItem('token');

    let page = 1;


    let response = await axios.post(`http://35.77.84.60:5000/user/getExpenses/${page}`,{Items_Per_Page: Items_Per_Page}, {headers: {"Authorization": token}})

    checkIfPremiumUser();

    if(response.status === 200 ){
       // console.log(response.data);
        //console.log(response.data.data[0]);
        console.log('?????????????');
        console.log(response.data);
        const listOfUsers = document.getElementById('listOfExpenses')

        console.log(response.data.info);
        listOfUsers.innerHTML = '';
        for(let i=0;i<response.data.data.length;i++)
            {
                
                showListofRegisteredExpenses(response.data.data[i]);
                
            }
            
            showPagination(response.data.info);
    }

    
    
      /*  axios.get("http://35.77.84.60:5000/user/getExpenses", {headers: {"Authorization": token}}).then((response)=>{
            //console.log(response.data.data[0]);
            checkIfPremiumUser();
            for(let i=0;i<response.data.data.length;i++)
            {
                
                showListofRegisteredExpenses(response.data.data[i]);
            }
            }).catch((err)=> console.log(err));  */        
})


    function checkIfPremiumUser(){
        let userType = localStorage.getItem('user');

        if(userType == "true"){
            premiumUser();
            reportDown();
            getPremiumLeaderboard();

        }
    }


    function reportDown(){
        const down = document.getElementById('report');
        down.innerHTML = 'report';
    }
    
        
    




function deleteUser(userId)
    {
        const token = localStorage.getItem('token');

        axios.delete(`http://35.77.84.60:5000/user/deleteExpense/${userId}`,{headers: {"Authorization": token}}).then((response)=>{
            removeItemFromScreen(userId);
        }).catch((err)=>{
            console.log(err);
        })
    }


    function editUser(userId,expenseDescription,expenseAmount,expenseCategory)
{
    document.getElementById('ed').value = expenseDescription; 
    document.getElementById('ea').value = expenseAmount;
    document.getElementById('cl').value = expenseCategory;

    deleteUser(userId);

}



function removeItemFromScreen(userId)
{
    
    const parentNode = document.getElementById('listOfExpenses');
    const elem = document.getElementById(userId)

    parentNode.removeChild(elem);

}

 async function payment(e) {
    const token = localStorage.getItem('token');
    const response  = await axios.get('http://35.77.84.60:5000/purchase/premiummembership', { headers: {"Authorization" : token} });
    console.log(response);
    var options =
    {
    "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
    "name": "Test Company",
    "order_id": response.data.order.id, // For one time payment
    "prefill": {
    "name": "Test User",
    "email": "test.user@example.com",
    "contact": "7003442036"
    },
    "theme": {
    "color": "#3399cc"
    },
    // This handler function will handle the success payment "color": "#3399cc"
    "handler": function (response) {
        console.log(response);
        axios.post('http://35.77.84.60:5000/purchase/updatetransactionstatus',{
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
        }, { headers: {"Authorization" : token} }).then(() => {
            localStorage.setItem('user', true);
            premiumUser();
            getPremiumLeaderboard();
            alert('You are a Premium User Now')
        }).catch(() => {
            alert('Something went wrong. Try Again!!!')
        })
    },
};
const rzp1 = new Razorpay(options);
rzp1.open();
e.preventDefault();

rzp1.on('payment.failed', function (response){
alert(response.error.code);
alert(response.error.description);
alert(response.error.source);
alert(response.error.step);
alert(response.error.reason);
alert(response.error.metadata.order_id);
alert(response.error.metadata.payment_id);
});
}

function reportGenerete(event){
    let usertype = localStorage.getItem('user');
    console.log(usertype == "true")
    if(usertype == "true"){
        window.location.href = './reports.html'
    }
}

function showPagination({currentPage,hasNextPage,hasPreviousPage,nextPage,previousPage,lastPage}){
    let page =1;
    const pagination= document.getElementById('pagination')
    

    pagination.innerHTML ='';

    if(hasPreviousPage){
        const button1 = document.createElement('button');
        button1.innerHTML = previousPage ;
        button1.addEventListener('click' , ()=>getPageExpenses(page,previousPage))
        pagination.appendChild(button1)
    }

    const button2 = document.createElement('button');
    button2.classList.add('active')
    button2.innerHTML = currentPage ;
    button2.addEventListener('click' , ()=>getPageExpenses(page,currentPage))
    pagination.appendChild(button2)

    if(hasNextPage){
        const button3 = document.createElement('button');
        button3.innerHTML = nextPage ;
        button3.addEventListener('click' , ()=>getPageExpenses(page,nextPage))
        pagination.appendChild(button3)
    }

    if( currentPage!=lastPage && nextPage!=lastPage && lastPage != 0){
        const button3 = document.createElement('button');
        button3.innerHTML = lastPage ;
        button3.addEventListener('click' , ()=>getPageExpenses(page,lastPage))
        pagination.appendChild(button3)
    }




}

async function getPageExpenses(page , limitper){
    const listOfUsers = document.getElementById('listOfExpenses')
 //   let Items_Per_Page = +document.getElementById('Items_Per_Page').value
 let Items_Per_Page = limitper                                 /*localStorage.getItem('itemsperpage')*/


    console.log('//////////////////');
    console.log(Items_Per_Page);

    
    
    const token = localStorage.getItem('token');
    let response = await axios.post(`http://35.77.84.60:5000/user/getExpenses/${page}`,{Items_Per_Page:Items_Per_Page} ,{headers: {"Authorization": token}})

    if(response.status === 200 ){
       // console.log(response.data);
        //console.log(response.data.data[0]);
        console.log(response);
        console.log('{{{{{{{{{{{{{{{{{{{{{{{{[');
        //console.log(response.data.info);
        listOfUsers.innerHTML = '';
      
        for(let i=0;i<response.data.data.length;i++)
            {

                
                showListofRegisteredExpenses(response.data.data[i]);
                
            }

            showPagination(response.data.info);
    }


}


function premiumUser(){

    const premium = document.getElementById('premium');
   

    premium.innerHTML = 'Its Premium Account'
    
    
    

    document.body.classList.remove('light');
    document.body.classList.add('dark');
    document.getElementsByClassName('center')[0].classList.remove('light');
    document.getElementsByClassName('center')[0].classList.add('dark');
    document.getElementById('expense-div').classList.remove('light');
    document.getElementById('expense-div').classList.add('dark');
    document.getElementById('left').classList.remove('light');
    document.getElementById('left').classList.add('dark');
    document.getElementsByTagName('input')[0].classList.add('dark');
    document.getElementById('right').style = 'display:block'

}


async function getPremiumLeaderboard(){
    const token = localStorage.getItem('token');
try {
const response = await axios.get('http://35.77.84.60:5000/expense/premiums', {headers : {'Authorization': token}} )

if(response.data.success){
    console.log(response);
    if(response.data.data.length>0){
        response.data.data.sort((a,b)=>{
            return a.totalExpense - b.totalExpense;
        });
        console.log(response.data.data[0].user.username);
        console.log(response.data.data[0].user)

       

        response.data.data.map((user, id)=>{
            console.log(id);
            showLeaderboard(user, id);
        })

    }
}

} catch (err) {
console.log(err);

}

}

function showLeaderboard(user , id){
    console.log(id);
    console.log(user);
    const leaderboardDiv = document.getElementById('right')
    let child = `<li class="leaderboardList">
            <p class="sno">${id+1} </p>
            <p class="name" id="user" onclick="openUserExpenses('${user.user.id}')">${user.user.username}</p>
            <p class="name">${user.totalExpense}</p>
    </li>`

    leaderboardDiv.innerHTML += child
}

function perPage(event){
    let Items_Per_Page = +document.getElementById('Items_Per_Page')
    let page = 1;
    event.preventDefault();
    console.log('*****************');
    console.log(Items_Per_Page);
    //console.log(typeof(+event.target.Items_Per_Page.value));
    //Items_Per_Page = +event.target.Items_Per_Page.value
    localStorage.setItem('itemsperpage' , +event.target.Items_Per_Page.value )
    Items_Per_Page = localStorage.getItem('itemsperpage')
    getPageExpenses(page, +event.target.Items_Per_Page.value);
    //event.target.Items_Per_Page.value
}

function openUserExpenses(user){

    console.log(user)
    localStorage.setItem('clickedUser' , user)
    window.location.href = './leaderboard.html'
    //yet to be completed
    //if clicked gets detailed payment of individual users
    //which makes  a post req to the user id another route let response = await axios.post('http://35.77.84.60:5000/expense/leaderboard-user'
}
