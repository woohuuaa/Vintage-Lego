/********************************************************************************
*  WEB322 – Assignment 03
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Wan-Hua Wu          Student ID: 152921227          Date: 2024-06-13
*
*  Published URL: vintage-lego.vercel.app
*
********************************************************************************/
const legoData = require("./modules/legoSets");

const express = require('express'); // "require" the Express module
const app = express(); // obtain the "app" object, coming from express library
const path = require('path'); // "require" the path module
const HTTP_PORT = process.env.PORT || 8080; // assign a port (what port this app listening)

// middleware
app.use(express.static('public'));

app.set('views', __dirname + '/views');

// Serve static files from the 'src' directory
app.use(express.static(path.join(__dirname, 'src')));

// routes you define, homepage route
app.get('/', (req, res) => {
    // send the data to the front end from the server
    res.sendFile(path.join(__dirname, "/views/home.html"));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/lego/sets", async (req, res) => {
    try 
    {   // If there is a "theme" query parameter present, 
        if (req.query.theme) 
        {   // respond with Lego data for that theme,
            let sets = await legoData.getSetsByTheme(req.query.theme);
            res.send(sets)
        }
        else 
        {   // respond with all of the unfiltered Lego data
            let sets = await legoData.getAllSets();
            res.send(sets);
        }
    } 
    catch (err) 
    {   // If any errors occurred, return the error message with the "404" status code
        res.status(404).send(err);
    }
});

app.get("/lego/sets/:num", async (req, res) => {
    try 
    {   // return the Lego set with a "set_num" value that 
        // matches the value after "/lego/sets/"
        let sets = await legoData.getSetByNum(req.params.num);
        res.send(sets);
    } 
    catch(err)
    {   // If any errors occurred, return the error message with the "404" status code
        res.status(404).send(err);
    }
});

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
});

legoData.initialize().then( () => {
    // start the server on the port and output a confirmation to the console
    app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
})