document.addEventListener("DOMContentLoaded", () =>{

let cardPage = document.createElement("div")
cardPage.setAttribute("Id",`page-${pageNumber}`)
document.getElementById("cardDisplay").appendChild(cardPage)
})

document.getElementById("logOut").addEventListener("click", logOut)
document.getElementById("mangaList").addEventListener("click", retrieveManga)
document.getElementById("userManga").addEventListener("click", (e) =>{ 
  document.querySelectorAll(".publicUser").forEach(e => e.style.display= "none"),
  document.querySelectorAll(".mangaUser").forEach(e => e.style.display= "" );
})
let loginData = {}
let sessionToken = ""
let mangaID = []
let publicmangaID =[]
let alreadyPull = false
let mangaCounter = 0
let pageNumber = 1
let totalMangaCounter = 1
let typeAccess = "mangaUser"
let mangaCover = ""
let mangaDescription = ""
let mangaTitle = ""
let userfollowdata= {}


let mangaCoverArray = []
let mangaAuthorArray = []
let mangaArtistArray = []


let login = {}
document.addEventListener("submit", (event) => { 
  event.preventDefault()
   login = ({
    "username":   document.querySelector('[name = "username"]').value,
  "password": document.querySelector('[name = "password"]').value,
  }) 
  loginUser()
  })

const getRequest = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': "application/json"
}}

//retrieve manga list form website
async function retrieveManga(){
  if (alreadyPull){
    document.querySelectorAll(".publicUser").forEach(e => e.style.display= "")
    document.querySelectorAll(".mangaUser").forEach(e => e.style.display= "none");
  }

   if (mangaCounter !== 0){
    mangaCounter = 0
    pageNumber = 1
    totalMangaCounter = 1
   }
   document.querySelectorAll(".mangaUser").forEach(e => e.style.display= "none");
   const response = await fetch("https://api.mangadex.org/manga?limit=100&year=2022&includedTagsMode=AND&excludedTagsMode=OR&publicationDemographic%5B%5D=shounen&contentRating%5B%5D=safe&order%5BlatestUploadedChapter%5D=desc", {
    headers: {
      Accept: "application/json"
    }
  })
  
.then(response => response.json())
.then(result => {
 
  numberOfManga = 100
  publicmangaID = result.data.map((x) => x.id ) //retrieve manga ID
  typeAccess = "publicUser"
  return publicmangaID, userfollowdata })
  .catch(error => console.log('error retrieving manga data', error))
 

  alreadyPull = true
  publicmangaID.forEach(retrieveMangaInfo)
  }  
  
 // retrieve user manga data
 async function retrieveMangaFollowList(sessionToken){
const response = await fetch(`https://api.mangadex.org/user/follows/manga?limit=100`, {
  headers: {
    Accept: "application/json",
    "authorization" : sessionToken
  }
})
.then(response => response.json())
  .then(result => {
numberOfManga = result.total
mangaID = result.data.map((x) => x.id ) //retrieve manga ID
return mangaID, userfollowdata })
.catch(error => console.log('error retrieving manga data', error))


mangaID.forEach(retrieveMangaInfo)
  }

 

// GET manga info
function retrieveMangaInfo(mangaID, type){
  fetch(`https://api.mangadex.org/manga/${mangaID}?includes[]=author&includes[]=artist&includes[]=cover_art`)
.then(resp => resp.json())
.then(result => {
  for (let element of result.data.relationships){
    if (element.type === "author"){
      mangaAuthorArray.push(element.attributes.name)
    } else if (element.type === "artist"){
      mangaArtistArray.push(element.attributes.name)
    } else if (element.type === "cover_art"){
      mangaCover = `https://uploads.mangadex.org/covers/${mangaID}/${element.attributes.fileName}`
    }
  }
  
  mangaDescription = result.data.attributes.description.en
  mangaTitle= Object.values(result.data.attributes.title)[0]
  mangaUpdate = result.data.attributes.updatedAt.slice(0,10)

  
if (mangaCounter<20 && totalMangaCounter -1 !==numberOfManga){
      totalMangaCounter +=1
      mangaCounter += 1

// Add card template
 let cardFram = document.createElement("div")
 cardFram.classList.add("card","mb-3", "bg-dark", typeAccess)
 cardFram.setAttribute("Id",`card-${mangaCounter}`)

 cardFram.style.cssText = "max-width: 1000px"
 document.getElementById(`page-${pageNumber}`).appendChild(cardFram)
 let cardRow = document.createElement("div")
 cardRow.classList.add("row","g-0", typeAccess)
 cardFram.appendChild(cardRow)
 let cardImg = document.createElement("div")
 cardImg.classList.add("col-md-4", typeAccess)
 cardRow.appendChild(cardImg)
 let cardTextFram = document.createElement("div")
 cardTextFram.classList.add("col-md-8", typeAccess)
 cardRow.appendChild(cardTextFram)
 let cardText = document.createElement("div")
 cardText.classList.add("card-body", typeAccess)
 cardTextFram.appendChild(cardText)

 //manga Title
let hTitle = document.createElement("h5")
hTitle.classList.add("card-title", typeAccess)
let boldTitle = document.createElement("strong")
boldTitle.innerText = "Title: " 
hTitle.innerHTML = mangaTitle
hTitle.classList.add("text-warning", typeAccess)
cardText.appendChild(boldTitle)
boldTitle.append(hTitle)

//manga Cover Art
let coverImg = document.createElement("img")
coverImg.classList.add("img-fluid","rounded-start", typeAccess)
coverImg.src = mangaCover
cardImg.appendChild(coverImg)


let pUpdate = document.createElement("p")
let pDescription = document.createElement("p")
pDescription.classList.add("card-text", typeAccess)

//manga Author
let pAuthor = document.createElement("p")
let boldAut = document.createElement("strong")
boldAut.innerText = "Author: "
for (let i=0;i<mangaAuthorArray.length;i++){
 pAuthor.innerHTML +=` ${mangaAuthorArray[i]}`
 if (i>=0 && i<mangaAuthorArray.length-1){
   pAuthor.innerHTML += ","
 }
 pAuthor.classList.add("text-warning", typeAccess)
 cardText.appendChild(boldAut)
 boldAut.append(pAuthor)
}

// manga Artist
let pArtist = document.createElement("p")
let boldArt = document.createElement("strong")
boldArt.innerText = "Artist: "
for (let i=0; i<mangaArtistArray.length;i++){
 if (i>=0 && i<mangaArtistArray.length-1){
   pArtist.innerHTML += ","
 }
 pArtist.innerHTML += ` ${mangaArtistArray[i]}`
 pArtist.classList.add("text-warning", typeAccess)
 cardText.appendChild(boldArt)
 boldArt.append(pArtist)
}

// manga Description
if (mangaDescription !== ""){
let boldDes = document.createElement("strong")
boldDes.innerText = "Description: "
pDescription.innerText = "Description:"
pDescription.innerText += mangaDescription
pDescription.classList.add("text-warning", typeAccess)
cardText.appendChild(boldDes)
boldDes.append(pDescription)
} else {
 pDescription.innerText = "No Desciption"
cardText.appendChild(pDescription)
      }
      if (totalMangaCounter/20%1 === 0 ){
        pageNumber +=1
        mangaCounter = 0
      let cardPage = document.createElement("div")
      cardPage.classList.add(typeAccess)
      cardPage.setAttribute("Id",`page-${pageNumber}`)
      document.getElementById("cardDisplay").appendChild(cardPage)
  }
  if (mangaAuthorArray.length !== 0){
    mangaAuthorArray.length = 0
  }  
  if (mangaArtistArray.length !== 0){
    mangaArtistArray.length = 0
  }  

//add hyperlink that takes you to the manga page on MangaDex.org
let hyperlink = document.createElement("a")
let link = document.createTextNode("Go to manga Page")
hyperlink.appendChild(link)
hyperlink.title="Go to manga Page"
hyperlink.target = "_blank"
hyperlink.rel="noopener noreferrer"
hyperlink.href = `https://mangadex.org/title/${mangaID}/${mangaTitle.replaceAll(" ","-")}`
cardText.appendChild(hyperlink)

return mangaAuthorArray, mangaArtistArray, mangaCover, result, mangaDescription, mangaTitle, mangaUpdate
}})
.catch(error => console.log('error retrieving manga Author, and artist', error))
} 


// login user
function loginUser(){
  fetch("https://api.mangadex.org/auth/login", {
   method: 'POST',
  headers:{ 'Content-Type' : 'application/json'},
  body: JSON.stringify(login),
  redirect: 'follow'})
    .then(response => response.json())
    .then(result =>{
       loginData = result
       sessionToken = loginData.token.session
       retrieveMangaFollowList(sessionToken)
       document.getElementById('form').style.display = "none"
       document.getElementsByClassName("topnav")[0].classList.remove("invisible")
    })
    .catch(error =>{
    document.getElementById("hiddenText").classList.remove("invisible")
    setTimeout(()=> document.getElementById("hiddenText").classList.add("invisible"), 3000)
  });
  }
  

function logOut(){
fetch("https://api.mangadex.org/auth/logout", {
  headers: {
    Accept: "application/json"
  },
  method: "POST"
})
.then(response => response.json())
  .then(result =>{
    while (document.getElementById("cardDisplay").firstChild) {
      document.getElementById("cardDisplay").removeChild(document.getElementById("cardDisplay").firstChild);
  }
  document.getElementById('form').style.display = "inline"
  document.getElementsByClassName("topnav")[0].classList.remove("invisible")
  })}