phase-1-project

## This project uses the free mangaDex API https://api.mangadex.org/docs/ to access the users manga follow list, and public manga list, and displays them as a list.

## To use the project, you would need to run the server.js file with the npm start command. Then go to https://localhost:3000 on your web browers

## once you're in, you will see a login screen in which you can either use your MangaDex.org account, or use the test account I created below:

username: TestAccountforProject            password: 123ABCDEF

## The screen will then load the current follow manga for the account provided with some details such as manga title, author, artist, description, and a quick link to take you to the manga page on MangaDex.org website.

## On the top part of the screen, you will see a navigation bar with three bottons, the first one is the logout button which logs the user off, and takes them back to the login screen. The second button is the a list of 100 manga that was access from the MangaDex.org. The third and final button is the users manga follow list which shows the users manga follow list.

## After you see the users manga follow list, you can click on the mangalist button to load the list of 100 manga. (note, you may need to wait a couple of seconds for the list to load since the API has a limit on the speed of information being sent and received to protect the website from any malicious attacks.

## you can then click the userManga button if you wanted to see the users follow list again, or click the logout button to log the user off.
