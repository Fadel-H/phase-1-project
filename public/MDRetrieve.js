let mangaCover = ""
let mangaAuthor = ""
let mangaArtist = ""
let mangaDescription = ""
let mangaTitle = ""

let mangaCoverArray = []
let mangaAuthorArray = []
let mangaArtistArray = []



let login = {}
document.addEventListener("submit", (event) => { 
  event.preventDefault()
   login = ({
    "username":   document.querySelector('[name = "username"]').value,
  "password": document.querySelector('[name = "password"]').value
  }) 
  loginUser()
  })

const getRequest = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': "application/json"
}}
let loginData = {}
let sessionToken = ""
let mangaID = []
let numberOfManga = 2



 // retrieve user manga data
 async function retrieveMangaFollowList(sessionToken){
const response = await fetch(`https://api.mangadex.org/user/follows/manga?limit=${numberOfManga}`, {
  headers: {
    Accept: "application/json",
    "authorization" : sessionToken
  }
})
.then(response => response.json())
  .then(result => {
mangaID = result.data.map((x) => x.id ) //retrieve manga ID
return mangaID })
.catch(error => console.log('error retrieving manga data', error))
mangaID.forEach(retrieveMangaInfo)
  }
    

// GET manga info
function retrieveMangaInfo(mangaID){
  fetch(`https://api.mangadex.org/manga/${mangaID}?includes[]=author&includes[]=artist&includes[]=cover_art`)
.then(resp => resp.json())
.then(result => {
mangaAuthorArray.push(result.data.relationships[0].attributes.name)
mangaArtistArray.push(result.data.relationships[1].attributes.name)
mangaCoverArray.push(`https://uploads.mangadex.org/covers/${mangaID}/${result.data.relationships[2].attributes.fileName}`)
mangaArtist = result.data.relationships[1].attributes.name
mangaAuthor = result.data.relationships[0].attributes.name
mangaCover = `https://uploads.mangadex.org/covers/${mangaID}/${result.data.relationships[2].attributes.fileName}`
mangaDescription = result.data.attributes.description.en
mangaTitle= result.data.attributes.title.en
appendMangaInfo(mangaAuthor, mangaArtist, mangaCover, mangaDescription,mangaTitle)
return mangaAuthor, mangaArtist, mangaCover, result, mangaDescription, mangaTitle
})
.catch(error => console.log('error retrieving manga Author, and artist', error))
}

// append manga info
function appendMangaInfo(mangaAuthor, mangaArtist, mangaCover,mangaDescription,mangaTitle){
  // appending manga info
let cardImg = document.getElementById("cardImport")
let cardText = document.getElementsByClassName("card-body")


let hTitle = document.createElement("h5")
hTitle.classList.add("card-title")
hTitle.innerHTML = mangaTitle
console.log(hTitle)
cardText[0].appendChild(hTitle)

let coverImg = document.createElement("img")
coverImg.classList.add("img-fluid","rounded-start")
coverImg.src = mangaCover
cardImg.appendChild(coverImg)

let pDescription = document.createElement("p")
pDescription.classList.add("card-text")
if (mangaDescription !== ""){
pDescription.innerText = mangaDescription
cardText[0].appendChild(pDescription)
} else {
  pDescription.innerText = "No Desciption"
cardText[0].appendChild(pDescription)
console.log(card)
}

let lastUpdate = document.createElement("p")
lastUpdate.classList.add("text-muted")
console.log(lastUpdate)
lastUpdate.innerHTML = "filler Text"
cardText[0].appendChild(lastUpdate)
}


// get all manga covers
//
// fetch("https://api.mangadex.org/cover?order[volume]=asc&manga[]=004e6dbe-b8cf-4f95-8ab2-e5f112ead297&limit=32&offset=0")
// .then(resp => resp.json())
//.then(result => console.log(result))


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
    })
    .catch(error => console.log('error', error));
  }