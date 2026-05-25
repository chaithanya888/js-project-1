//---------------------Login and Create Account functions------------//
document.getElementById("login").addEventListener("click",addAcnt);
document.getElementById("newAccount").addEventListener("click",CreateAcnt);

localStorage.setItem("auth",false);

async function addAcnt(){
    Id=document.getElementById("userId").value;
    password=document.getElementById("userPassword").value;
    let res=await fetch("http://localhost:3000/user",{method:"GET"});
let user=await res.json();

user.map((obj)=>{
if(obj.userId.trim().toLowerCase()==Id.trim().toLowerCase() &&
 obj.password.trim().toLowerCase()==password.trim().toLowerCase()){
    addDataLocal(true,obj.id);
    
 }
});


function addDataLocal(status,Id){
    if(status){
       localStorage.setItem("auth",true);
       localStorage.setItem("id",Id);
       window.location.href="index.html";
       
    }else{
       alert("Invalid Username or password");
    }
}

document.getElementById("userId").value="";
document.getElementById("userPassword").value="";


}
let off=false;
let account=document.createElement("div");

let createAccount =document.getElementById("createAccount");
async function CreateAcnt() {
    if(off=!off){   
        account.innerHTML=`
        <label for="userName">Enter User Name:</label>
        <input type="text" placeholder="Enter the username" id="userName">
        <label for="newUserId">Enter UserId:</label>
        <input type="text" placeholder="Enter the user-ID" id="newUserId">
        <label for="newUserPassword">Enter Password:</label>
        <input type="password" placeholder="Enter the password" id="newUserPassword">
        <button type="button" id="submit">Submit</button>`;
        createAccount.appendChild(account);
        document.getElementById("submit").addEventListener("click",submitAccount);
    }else{
        account.remove();
    }
    
}

const p=document.createElement("p");
createAccount.append(p);
async function submitAccount(){
    username=document.getElementById("userName").value;
    userinput=document.getElementById("newUserId").value;
    passwordinput=document.getElementById("newUserPassword").value;
    console.log(username);

    p.innerHTML="";
    if(userinput==""){
         p.innerHTML += `<p style="color: red; font-size: 14px; margin-top: 8px;">Please enter a valid username</p>`;
          return;
    }else if(passwordinput=="" || username==""){
        p.innerHTML += `<p style="color: red; font-size: 14px; margin-top: 8px;">Please enter a valid password</p>`;
        return;
    }else{
         let obj={
        "name":username,
        "userId":userinput,
        "password":passwordinput
    }
    let res=await fetch("http://localhost:3000/user",{
        method:"POST",
        headers:{
            "content-type":"application/json"
        },
        body:JSON.stringify(obj)
    });
    if(!res.ok){
        alert("Something went wrong");
    }else{
        alert("Account has been Successfully created.");
        window.location.reload();
    }
    
    }


   
}

