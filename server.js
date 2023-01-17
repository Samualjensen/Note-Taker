// node modules and requirments
const express = require ('express');
const path = require('path');
const app = express();

// helper function to generate id
const uuid = require("./helpers/uuid")

// import helper function
const { readFromFile, writeToFile, readAndAppend } = require('./helpers/fsUtils');

// port variable  
const PORT = process.env.PORT || 3001; 

// Middleware for json data 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// GET route for homepage
app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET route for notes page
app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET route for all notes
app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received.`);
    // Using Read From File helper function to display all notes from the database.
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
  });

  // POST route for new note
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received.`); 
    const { title, text } = req.body; 
    if (req.body) {
      const newNote = {
        title,
        text,
        id: uuid(),
      };
      
      // display new note
      readAndAppend(newNote, './db/db.json');
      res.json(`Note added successfully!`);
    } else {
      res.error('Error in adding note.');
    }
  });

// route for deleting a note
app.delete(`/api/notes/:id`, (req, res) => {
  
    // logs that a request for deleting a note has been made
  console.info(`${req.method} request received.`);
  
  const { id } = req.params.id;
  
  // parse data into json data
  readFromFile('./db/db.json').then((notesData) => {
      let data = JSON.parse(notesData);
      
      // filter through notes and collect all of them besides the one being deleted 
      data = data.filter(({ id }) => id !== req.params.id);
     
      // writes all notes besides one being deleted back into db.json
      writeToFile('./db/db.json', data);
      res.json(`Note has been deleted.`);
    });
  });

  // listen to port 3001
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);