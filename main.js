//---------------------Category button & auth with Item Display functions------------//
let foodcontainer=document.getElementById("food-container");

let container=document.getElementsByClassName("container")[0];



//document.getElementById("btn-1").addEventListener("click",searchCategory);

function checkAuth(category){
 if(localStorage.getItem("auth")=="true"){
    if(category==""){
         return true;
    }else{
        foodcontainer.innerHTML="";
        loading(true);
        searchCategory(category);
    }

 }else{
    alert("Please login to access the content");
    window.location.href="loginpage.html";
 }
}

async function searchCategory(selection){
    container.innerHTML="";
    loading(true);
    let res=await fetch("http://localhost:3000/category");
    let data=await res.json();
 
        for(let i=0;i<data[selection].length;i++){
    
            let div=document.createElement("div");
            div.innerHTML = `
            <img src="${data[selection][i].image}">
            <a>${data[selection][i].name}</a>
            <p>Price: ${data[selection][i].price}</p>
            <p>Location: ${data[selection][i].location}</p>
            ${selection == "health" ? `<p>Clinic: ${data[selection][i].clinic}</p>` : ""}
            <p>Rating: ${await averageOfRatings(data[selection][i].rating)}</p>
            <p>${data[selection][i].about}</p>
            <button onclick="addReview(${data[selection][i].id})">Add Review</button>`;

            container.append(div);
            loading(false);
        
        }
        
    document.getElementById("Search").value=`${selection}`;
}

async function  averageOfRatings(ratings) {
    let sum=0;
        for(let i=0;i<ratings.length;i++){
            sum+=ratings[i];
        }
    let average=sum/ratings.length;
    return parseFloat(average.toFixed(1));
}



//----------------------Searching & Filtering functions------------//

async function onSearch(value) {
    container.innerHTML="";
    loading(true);
    let res=await fetch("http://localhost:3000/category");
    let data=await res.json();
     console.log(value);
    let searchItems= Object.values(data).flat();
    searchItems.filter(async (obj) => {
        if(obj.name.trim().toLowerCase().includes(value.trim().toLowerCase())){
            console.log(obj.name);
            let div=document.createElement("div");
               div.innerHTML = `
               <img src="${obj.image}">
               <a>${obj.name}</a>
               <p>Price: ${obj.price}</p>
               <p>Location: ${obj.location}</p>
               ${obj.name.includes("Dr.") ? `<p>Clinic: ${obj.clinic}</p>` : ""}
               <p>Rating: ${await averageOfRatings(obj.rating)}</p>
               <p>${obj.about}</p>
               <button onclick="addReview(${obj.id})">Add Review</button>`;
        
               container.append(div);
               loading(false);
        }
    });

    
}
//---------------------loading function--------------//
async function loading(status) {

    if(status){
        container.innerHTML="";
        foodcontainer.innerHTML="";
        let loadDiv=document.createElement("div");
        loadDiv.id="loading";
        loadDiv.innerHTML=`<p style="text-align: center; color: #0EA5E9;">Loading...</p>`;
        container.append(loadDiv);
        
    }else{
        if(loadDiv){
            loadDiv.remove();
            loadDiv=null;
        }
        
    }
}

//----------------------Adding Review and Rating functions------------//

async function addReview(id){
    console.log(id);
    console.log(localStorage.getItem("id"));
    container.innerHTML="";
    foodcontainer.innerHTML="";
    loading(true);
    let res=await fetch(`http://localhost:3000/category`);
    let data=await res.json();
    let reviewItems= Object.values(data).flat();
    reviewItems.map((obj)=>{
        if(obj.id==id){
            let div=document.createElement("div"); 
            div.innerHTML = `
            <img src="${obj.image}">
            <a>${obj.name}</a>
            <p>Price: ${obj.price}</p>
            <p>Location: ${obj.location}</p>
            ${obj.name.includes("Dr.") ? `<p>Clinic: ${obj.clinic}</p>` : ""}
            <p>Rating: ${averageOfRatings(obj.rating)}</p>
            <p>${obj.about}</p>
            <textarea id="review" placeholder="Write your review here"></textarea><br>
            <input type="number" id="rating" placeholder="Rate 1-5"><br>
            <button onclick="submitReview(${obj.id})">Submit Review</button>`;
            container.append(div);
            loading(false);
        }
    });

}

async function submitReview(id){
    let review=document.getElementById("review").value;
    let rating=parseInt(document.getElementById("rating").value);
    if(rating<1 || rating>5){
        alert("Please enter a valid rating between 1 and 5");
        return;
    }
    let res=await fetch(`http://localhost:3000/category`);
    let data=await res.json();
    let reviewItems= Object.values(data).flat();
    reviewItems.map(async (obj)  =>{
        if(obj.id==id){
            let res=await fetch(`http://localhost:3000/category/${obj.id}`,{
                method:"PATCH",
                headers:{
                    "content-type":"application/json",
        },
        body:JSON.stringify({
            "review":review,
            "rating":rating
        })
            });
        }
    });}