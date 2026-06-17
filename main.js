//---------------------Category button & auth with Item Display functions------------//

const displaySection=document.getElementById("display-section");

const container=document.getElementsByClassName("container")[0];


//document.getElementById("btn-1").addEventListener("click",searchCategory);

function checkAuth(category){
 if(localStorage.getItem("auth")=="true"){
    if(category==""){
         return true;
    }else{
        displaySection.innerHTML="";
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
    let res=await fetch("http://localhost:3000/category");
    let data=await res.json();
    
    loading(true);
    if(res.ok){
        document.getElementsByClassName("itemsFilter")[0].style.display="block";
        document.getElementsByClassName("range-filters")[0].style.display="block";

    }
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
    }
    loading(false);
    
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
     if(res.ok){
        document.getElementsByClassName("itemsFilter")[0].style.display="block";
        document.getElementsByClassName("range-filters")[0].style.display="block";
    }
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
               <p>Rating: ${averageOfRatings(obj.rating)}</p>
               <p>${obj.about}</p>
               <button onclick="addReview(${obj.id})">Add Review</button>`;
        
               container.append(div);
               loading(false);
        }
    });

    
}

const priceRange=document.getElementById("PriceRange");
const priceValue=document.getElementById("priceValue");
priceRange.addEventListener("input",async function(){
    priceValue.textContent=`${priceRange.value}$`
});
  const ratingRange=document.getElementById("ratingRange");
  const ratingValue=document.getElementById("ratingValue");
  ratingRange.addEventListener("input",async function(){
    ratingValue.textContent=`${ratingRange.value}`
  })

  
    async function filterbyItems(itemType){
if(itemType=="c"){

}
      let itemsAksed=document.getElementById("Order").value;
      if(!itemType){
        let checkedRadio = document.querySelector('input[name="filter"]:checked');
        if (checkedRadio) {
        itemType = checkedRadio.value;
        };
      }
    
    if(!itemsAksed  || !itemType){
        return;
    }
        container.innerHTML="";
        loading(true);

    let res=await fetch("http://localhost:3000/category");
    let data=await res.json();
    let searchItems= data[itemType];
    console.log(itemsAksed);
    console.log(itemType);
    console.log(searchItems);
    
    
    let start   = itemsAksed === "Old" ? 0 : searchItems.length - 1;
    let end     = itemsAksed === "Old" ? searchItems.length : -1;
    let step    = itemsAksed === "Old" ? 1 : -1;

    for (let i = start; i !== end; i += step) {
    let div = document.createElement("div");
    div.innerHTML = `
     <img src="${searchItems[i].image}" style="width: 8rem; height: auto;"><br>
        <a>${searchItems[i].name}</a>
        <p>Price: ${searchItems[i].price}</p>
        <p>Location: ${searchItems[i].location}</p>
        ${searchItems[i].name.includes("Dr.") ? `<p>Clinic: ${searchItems[i].clinic}</p>` : ""}
        <p>Rating: ${await averageOfRatings(searchItems[i].rating)}</p>
        <p>${searchItems[i].about}</p>
        <button onclick="addReview(${searchItems[i].id})">Add Review</button>
    `;
    displaySection.append(div);
}

loading(false);
    };

async function priceAndrating() {
    let priceRange=document.getElementById("PriceRange").value;
    let ratingRange=document.getElementById("ratingRange").value;

     let itemsAksed=document.getElementById("Order").value;
     let checkedRadio = document.querySelector('input[name="filter"]:checked');
     if(!itemsAksed && !checkedRadio){
     console.log(priceRange);
        console.log(ratingRange);
        let res=await fetch("http://localhost:3000/category");
        let data=await res.json();
        let searchItems= Object.values(data).flat();
        container.innerHtml="";
        loading(true);
        searchItems.filter(async (obj)=>{
            if(obj.rating<=ratingRange  && obj.price<=priceRange){
                renderItems(obj);
            }
            if(obj.ratingRange==0 && obj.price<=priceRange){
                renderItems(obj);
            }
            if(obj.price==0 && obj.rating<=ratingRange){
                renderItems(obj);
            }
            loading(false);
        })
    }else{
        filterbyItems(obj);
    }

    }
    
    
    
    
    async function renderItems(obj){
    console.log("gathered items"); 
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
    }






//---------------------loading function--------------//
async function loading(status) {

    if(status){
        container.innerHTML="";
        displaySection.innerHTML="";
        let loadDiv=document.createElement("div");
        loadDiv.id="loading";
        loadDiv.innerHTML=`<p style="text-align: center; color: #0EA5E9;">Loading...</p>`;
        container.append(loadDiv);
        
    }else{
        let loadDiv=document.getElementById("loading");
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
    displaySection.innerHTML="";
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
            <p>${obj.about}</p>
            <textarea id="review" placeholder="Write your review here"></textarea><br>
            <input type="number" id="rating" placeholder="Rate 1-5"><br>
            <p style="color: red;" id="rating-error"></p>
            <button id="submit-review" onclick="submitReview(${obj.id})">Submit Review</button>
            `;
            container.append(div);
            loading(false);
        }
    });

}

async function submitReview(id) {
    let review = document.getElementById("review").value;
    let rating = parseInt(document.getElementById("rating").value);

    if (rating < 1 || rating > 5) {
        let ratingError = document.getElementById("rating-error");
        ratingError.textContent = "Please enter a valid rating between 1 and 5.";
        return;
    }

    // ✅ update category (same as before)
    let res = await fetch(`http://localhost:3000/category`);
    let data = await res.json();

    for (let key in data) {
        let obj = data[key].find(obj => obj.id == id);
        if (obj) {
            obj.rating.push(rating);
            obj.reviews.push(review);

            let getRes = await fetch(`http://localhost:3000/category`, {
                method: "PATCH",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ [key]: data[key] })
            });

            if (getRes.ok) {
                let userRes = await fetch(`http://localhost:3000/user/${localStorage.getItem("id")}`);
                let userData = await userRes.json();
                let newReview = {
                    "item-id": id,
                    "item-rating": rating,
                    "item-review": review
                };

                
                let backres = await fetch(`http://localhost:3000/user/${localStorage.getItem("id")}`, {
                    method: "PATCH",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({
                        "my-reviews": [...userData["my-reviews"], newReview]
                    })
                });

                if (backres.ok) {
                    let ratingError = document.getElementById("rating-error");
                    ratingError.textContent = "Review submitted successfully!";
                    ratingError.style.color = "green";
                    setTimeout(() => {
                        document.getElementById("review").remove();
                        document.getElementById("rating").remove();
                        document.getElementById("submit-review").remove();
                        location.reload();
                    }, 400);
                } else {
                    console.error(backres.statusText);
                }
            } else {
                console.error(getRes.statusText);
            }
        }
    }
}


//------------------------Account Button All Functions------------------//

const accountBtn=document.getElementById("account-btn");
accountBtn.addEventListener("click",openAccountPage);

function openAccountPage() {
    window.location.href="account.html";
}

//-----------------------review dispaly function------------------//

window.onload= async () => {
    await dispalyItems();
}

async function dispalyItems() {
    let res=await fetch(`http://localhost:3000/category`);
    let data=await res.json();
    var displayItems=Object.values(data).flat();
    displayItems.forEach((obj)=>{
        let div=document.createElement("div");
        div.innerHTML+=`
        <img style="width: 8rem; height: auto;" src="${obj.image}"><br>
        <a>${obj.name}</a>
        <p>Price: ${obj.price}</p>
        <p>Location: ${obj.location}</p>
        ${obj.name.includes("Dr.") ? `<p>Clinic: ${obj.clinic}</p>` : ""}
        <div>${listReviews(obj)} </div>
        `;
        displaySection.append(div);
    })
    
}


function getStarWidth(fontSize) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.font = `${fontSize}px Arial`;
  return ctx.measureText("★").width; 
}

function createStar(rating) {
  let maxStars = 5;
  const fontSize = 24;
  
  const starWidth = getStarWidth(fontSize);
  const totalWidth = maxStars * starWidth;
  const fillWidth = (parseFloat(rating) / maxStars) * totalWidth;

  return `
    <div style="
      position: relative;
      display: inline-block;
      width: ${totalWidth}px;
      height: ${fontSize}px;
      font-size: ${fontSize}px;
      font-family: Arial;
      line-height: 1;
    ">
      <div style="
        position: absolute;
        top: 0; left: 0;
        width: ${totalWidth}px;
        color: #ccc;
        white-space: nowrap;
        overflow: hidden;
        font-family: Arial;
      ">${'★'.repeat(maxStars)}</div>

      <div style="
        position: absolute;
        top: 0; left: 0;
        width: ${fillWidth}px;
        color: #f5a623;
        white-space: nowrap;
        overflow: hidden;
        font-family: Arial;
      ">${'★'.repeat(maxStars)}</div>
    </div>
  `;
}

function listReviews(obj) {
  let list = "";

 
  obj.reviews.forEach((review, index) => {
    let rating = obj.rating[index];  

    list += `
      <div style="margin: 8px 0; padding: 8px; border: 1px solid #eee; border-radius: 6px;">
        ${createStar(rating)}
        <li style="margin-top: 4px;">${review}</li>
      </div>
    `;
  });

  return list;
}