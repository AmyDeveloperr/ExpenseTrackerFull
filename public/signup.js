
    
function signUp(event) {
  event.preventDefault();
  const username = event.target.username.value;
  const email = event.target.emailId.value;
  const password = event.target.password.value;
  //const exist= document.querySelector('existing');
  //exist.innerHTML = '';

  
  const obj = {
      username,
      email,
      password
  }

  axios.post("http://35.77.84.60:5000/user/signup", obj)
  .then((response)=>{
      
      console.log(response);
      if(response.status === 201)
      {
          window.location.href = "./login.html"
          console.log('sign up complete');
      }
      else if(response.status === 207)
      {
          showExistingUser(response.data.message);
          //exist.innerText = '';
          //exist.innerText = `<h2>${response.data.newUserDetail}</h2>` 

      }

      else{
          throw new Error('Error failed to login')
      }
      
      
      //showListofRegisteredUser(response.data.newUserDetail)
      //console.log(response)
  })
  .catch((err)=> {
      console.log(err)
  })



  
}

function showExistingUser(user){
 // console.log(user);
//   const show = user.newUserDetail;
  const parentNode = document.getElementById('listOfUsers');
  const createNewUserHtml = `<li >${user} 
                                  
                              </li>
                              `

  parentNode.innerHTML +=  createNewUserHtml;

 // document.getElementById("username").value = "";
// document.getElementById("emailId").value = "";
//  document.getElementById("phoneNo").value = "";
 
}

/*
window.addEventListener('DOMContentLoaded', (event) => {
  console.log('555');
  
  axios.get("http://35.77.84.60:5000/user/signup")
  .then((response)=>{
      console.log(response)
      
/*
      for(let i=0;i<response.data.length;i++)
      {
          showListofRegisteredUser(response.data[i]);
      }
      */

//   }).catch((error)=> console.log(error));

  

//  })

//re comment this out

/*       function showListofRegisteredUser(user){
  const parentNode = document.getElementById('listOfUsers');
  const createNewUserHtml = `<li id=${user.id}>${user.name} - ${user.email} - ${user.phoneNo}
                                  <button onclick="deleteUser('${user.id}')">Delete</button>
                              </li>
                              `

  parentNode.innerHTML +=  createNewUserHtml;
 // document.getElementById("username").value = "";
// document.getElementById("emailId").value = "";
//  document.getElementById("phoneNo").value = "";
 
}*/
/*
function deleteUser(userId) {
  axios.delete(`http://35.77.84.60:4000/user/deleteUser/${userId}`)
  .then((response)=>{
      removeItemFromScreen(userId)
  }).catch((err)=> {
      console.log(err);
  })
 
}
*/
/*
function removeItemFromScreen(userId){
  const parentNode = document.getElementById('listOfUsers');
  const elem = document.getElementById(userId)
  parentNode.removeChild(elem);
}
*/


