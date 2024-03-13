// http://docs.lyricsovh.apiary.io/
// https://api.lyrics.ovh/v1/artist/title

// maybe I can use image api to search for an album cover

// modify ui, image api

import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

const API_URL = "https://api.lyrics.ovh/v1";
const SPOTIFY_API_URL = "https://api.spotify.com/v1";
const spotifyToken = 'BQA0zY1xJCZKFNbvF6mVtTSezs5b6eJh8q15cESb3teOME1BujanWaKkxt83qRIZ_QHexKrmDWA4uEbLJhbG35TDRbzIFOfXOqKt02t-u6vfWaBBgnIVvyQHpbOcEpIkcHDWPcO5AfUT15oZCDbJihjkshQBzSgz0SY_6r12rWoLCwii6K8brwPVBz8SeLjN21mqvchxyHfn331IjjZh9E4kP0pRQud9q7gNjEIMJgNWrca9s1Qhxvhq9cJAlEMZ2dAD9He7rQDVNezNq_hk8d_MRXas';

const config = {
   headers: { Authorization: `Bearer ${spotifyToken}`},
}

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let lyricsData = ["Don't wanna sober up~🎇"];

async function searchTrack(artistName, songName) {
    try {
        const response = await axios.get(
            `${SPOTIFY_API_URL}/search?q=${encodeURIComponent(artistName + " " + songName)}&type=track`, config
            );
        
        const track = response.data.tracks.items[0];

        return track.album.id;
    } catch (error) {
        console.error("Failed to search for track: ", error.message);
        throw error;
    }
}

async function getAlbumCover(artistName, songName) {
    try {
        const albumID = await searchTrack(artistName, songName);
        const response = await axios.get(`${SPOTIFY_API_URL}/albums/${albumID}`, config);

        return response.data.images[0].url;
    } catch (error) {
        console.error("Failed to get album cover: ", error.message);
        throw error;
    }
}

app.get("/", (req, res) => {
    res.render("index.ejs", {lyrics: lyricsData});
});

app.post("/", async (req, res) => {
    const artistName = req.body.artist;
    const songName = req.body.title;

    try {
        const response = await axios.get(`${API_URL}/${artistName}/${songName}`);
        const lyrics = response.data.lyrics;

        const coverUrl = await getAlbumCover(artistName, songName);

        lyricsData = Array.isArray(lyrics) ? lyrics : lyrics.split("\n\n");

        res.render("index.ejs", {
            title: songName,
            artist: artistName,
            lyrics: lyricsData,
            coverUrl: coverUrl
        });
        console.log("Type of lyricsData:", typeof lyricsData);

    } catch (error) {
        console.error("Failed to make request: ", error.message);
        res.render("index.ejs", {
            title: songName,
            artist: artistName,
            lyrics: "error"
        });
        console.log("Type of lyricsData:", typeof lyricsData);

    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});