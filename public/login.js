
    
function logIn(event) {
  event.preventDefault();
  const email = event.target.emailId.value;
  const password = event.target.password.value;
     
  const obj = {
  
      email,
      password
  }

  axios.post("http://35.77.84.60:5000/user/login", obj)
  .then((response)=>{
      console.log(response);
      localStorage.setItem('token', response.data.token);
      if(response.status === 200)
      {
           localStorage.setItem('user', false);
           window.location.href = "./expense.html"
           redirect('./expense.html')
      }
      else if(response.status === 207)
      {
          //console.log('response 207');
          showIfUserNotExists(response.data.message);
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

function showIfUserNotExists(user){
 // console.log(user);
//   const show = user.newUserDetail;
  const parentNode = document.getElementById('listOfUsers');
  const createNewUserHtml = `<li >${user} 
                                  
                              </li>
                              `
  parentNode.innerHTML +=  createNewUserHtml;
 
}

