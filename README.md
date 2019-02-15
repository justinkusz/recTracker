# RecTracker

A single-page web app for keeping track of books, movies, TV shows and music recommended to you by others.

Written entirely in Javascript, built on a MERN stack ([MongoDB](https://www.mongodb.com/), [Express](https://expressjs.com/), [React](https://reactjs.org/), [Node](https://nodejs.org/en/)).

## About

RecTracker started primarily as a way for me to learn and practice building a full-stack web application in Javascript. Aside from that, I often find myself really enjoying a movie, and wondering:

*Who was it that recommended this to me?*

### Features

* Current:
  * Sort by new/old recommendations
  * Filter by media type (movie, TV, book, album)
  * Filter by title or recommender name
  * Search by title when adding a new album via the [Discogs API](https://www.discogs.com/developers/)
  * Search by title when adding a new movie via [The Movie Database API](https://developers.themoviedb.org/3)

* Planned:
  * Search by title when adding a new book
  * Search by title when adding a new TV show


### Screenshots

New Recommendations | Add new movie
------------------- | --------------
![New Recs](/docs/img/new-recs.png) | ![Add movie](/docs/img/movie-search.png)


### Get Started

1. Clone the repository: `git clone https://github.com/justinkusz/recTracker.git`
2. Install dependencies: `cd recTracker && npm install`
3. Start the server & client: `npm start`