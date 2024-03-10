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

app.post("/", async (req, res) => {
    const artistName = req.body.artist;
    const songName = req.body.title;

    try {
        const response = await axios.get(`${API_URL}/${artistName}/${songName}`);
        lyricsData = response.data.lyrics.split("\n\n");

        res.render("index.ejs", {
            title: songName,
            artist: artistName,
            lyrics: lyricsData
        });
    } catch (error) {
        console.error("Failed to make request: ", error.message);
        res.render("index.ejs", {
            title: songName,
            artist: artistName,
            lyrics: "error"
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});