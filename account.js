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

    }else{
        getUserData(id);
    }
}


async function getUserData(id){
let res=await fetch(`http://localhost:3000/user/${id}`);
let data=await res.json();
console.log(data);
let res2=await fetch(`http://localhost:3000/category`);
let data2=await res2.json();
let items=Object.values(data2).flat();

items.forEach((item)=>{
    let index=data["my-reviews"].findIndex((review)=>review["item-id"]===item.id);
    if(index !== -1){
         console.log(item);
         let container2=document.querySelector(".container-2");
         let itemDiv=document.createElement("div");
         itemDiv.classList.add("item");
         itemDiv.innerHTML=`
         <img src="${item.image}" alt="${item.name}" style="width: 8rem; height: auto;">
         <h3>${item.name}</h3>
         <p>Rating: ${data["my-reviews"][index]["item-rating"]}</p>
         <p>Review: ${data["my-reviews"][index]["item-review"]}</p>
         <button onclick="editReview(${item.id})">Edit Review</button>
         <button onclick="deleteReview(${item.id})">Delete Review</button>
         `;
         container2.appendChild(itemDiv);
    }
})
}

const logoutButton=document.getElementById("logout");
logoutButton.addEventListener("click",()=>{
    localStorage.removeItem("id");
    localStorage.removeItem("auth");
    window.location.href = "loginpage.html";
})

async function editReview(itemId){
    let container2=document.querySelector(".container-2");
container2.innerHTML="";
let res=await fetch(`http://localhost:3000/category`);
let data=await res.json();
let items=Object.values(data).flat();
items.forEach((item)=>{
    if(item.id===itemId){
        let itemDiv=document.createElement("div");
            itemDiv.classList.add("item");
            itemDiv.innerHTML=`
            <img src="${item.image}" alt="${item.name}" style="width: 8rem; height: auto;">
            <h3>${item.name}</h3>
            <textarea id="review" placeholder="New Review"></textarea><br>
            <input type="number" id="rating" placeholder="New Rating (1-5)" min="1" max="5"><br>
            <button onclick="saveReview(${item.id})">Save Review</button>
            `;
            container2.appendChild(itemDiv);
    }
})
}

async function saveReview(param) {
    let newReview = document.getElementById("review").value;
    let newRating = parseInt(document.getElementById("rating").value);  
    if (newReview && newRating >= 1 && newRating <= 5) {
        let userRes = await fetch(`http://localhost:3000/user/${localStorage.getItem("id")}`);
        let userData = await userRes.json();
        let reviewIndex = userData["my-reviews"].findIndex((review) => review["item-id"] === param);
        if (reviewIndex !== -1) {
            userData["my-reviews"][reviewIndex]["item-review"] = newReview;
            userData["my-reviews"][reviewIndex]["item-rating"] = newRating;
        }
        let backRes = await fetch(`http://localhost:3000/user/${localStorage.getItem("id")}`, {
            method: "PATCH",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(userData)
        });

       let backData = await backRes.json();
      





        if (backData.ok) {

            let categoryRes = await fetch(`http://localhost:3000/category`);
        let categoryData = await categoryRes.json();
        let items = Object.values(categoryData).flat();

        for (let item of items) {
            if (item.id === param) {
                item.rating.splice(indexToRemove, 1);
                item.reviews.splice(indexToRemove, 1);

                let updateRes = await fetch(`http://localhost:3000/category/${item.id}`, {
                    method: "PATCH",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify(item)
                });

                continue; 
            }}

            console.log("Review updated successfully.");

            let container2=document.querySelector(".container-2");
            let itemDiv=document.createElement("div");
            itemDiv.innerHTML=`<h3 style="color: green;">Review updated successfully.</h3>`;
            container2.appendChild(itemDiv);
            setTimeout(() => {
            window.location.reload();
            },5000);
        } else {
            console.error("Failed to update review.");
        }
    } else {
        console.error("Invalid review or rating.");
    }}