// http://docs.lyricsovh.apiary.io/
// https://api.lyrics.ovh/v1/artist/title
// maybe I can use image api to search for an album cover

import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://api.lyrics.ovh/v1";

app.use(bodyParser.urlencoded({extended: true}));

let lyricsData = "Don't wanna sober up~🎇";

app.get("/", (req, res) => {
    res.render("index.ejs", {lyrics: lyricsData});
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});