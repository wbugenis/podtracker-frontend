# podtracker (frontend)

This is the frontend repo for podtracker, a website for searching, tracking, and listening to podcasts. It's built with a React frontend, a Rails backend, and a mix of custom CSS and Material UI components.

## Features
- Users can search for podcasts utilizing the iTunes API, then view details and follow any of the podcasts from the results, which is done by saving the podcast's RSS feed.
- Once a user tracks a podcast, they can view the podcast on their Home page, where the podcast's RSS feed is scraped to put together a list of all of the episodes and their respective details. Each episode in the list can be marked as played, or played directly on the site.
- Audio playback capabilities on the site were built with the [@cassette library](https://github.com/benwiley4000/cassette), with custom buttons added to skip 30 seconds or back 10 seconds on the podcasts. Episodes can be queued in the player, and if you play another episode on the site, the site will track what time you left off at on the episode that just stopped playing.
- Users can add an RSS feed link directly without going through the search, in case the feed they want is not listed on iTunes.
- App has full authentication implemented, and utilizes locally stored JSON Web Tokens to allow users to leave and come back to the site without logging in again.

## Usage
- Run 'rails s' in the backend directory to start the server on http://localhost:3000
- Run 'npm start' in the frontend directory to start the app on http://localhost:4000
- Once you register your account, you can begin searching, tracking, and listening to podcasts!
