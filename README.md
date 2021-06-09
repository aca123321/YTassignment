# YTassignment

*An API that fetches the most relevant results for the given search term*
________________
* Stores the results for an overarching term in mongodb (eg. cricket, football, etc)
* apiRequest.js periodically makes calls to the Youtube Data API V3 to store the results in an output file
* DataAggregator.js periodically checks to see if any pending data (from the output file) is to be stored in the database (Uses mongo db for database).
________________
* server.js runs an express server that services the GET requests. 
* Required API endpoint URI: "/"
* parameters to be sent are: 
  1) resPerPage (results per page)
  2) q (the search term)
  3) curPage (the required page number)
* The results will be displayed as a JSON array required objects as shown below:

![API endpoint](https://github.com/aca123321/YTassignment/blob/master/readme_images/get_request.png?raw=true)
________

### Initialise as a node project
1) Install node. (npm should come installed along with node installation)
2) Clone this repository.
3) run `npm install` in the repository's root directory to install the dependencies of the project.
4) Install MongoDB.
5) Set up all config variables marked by the `// TODO` comments according to your local preferences.
6) run `npm start` to start the processes (This also starts the express server for the required API).
