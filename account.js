window.onload=()=>{
    let id=localStorage.getItem("id");
    let auth=localStorage.getItem("auth");
    if(!id||auth!=="true"){
    const message=document.querySelector(".message");
    const container=document.getElementById("container");
    
        let loginLink=document.createElement("a");
        loginLink.href="loginpage.html";
        loginLink.textContent="Please log in to view your account.";
        message.appendChild(loginLink);
        container.innerHTML="";

    }
}