// http://docs.lyricsovh.apiary.io/
// https://api.lyrics.ovh/v1/artist/title

// maybe I can use image api to search for an album cover

// modify ui

import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const API_URL = "https://api.lyrics.ovh/v1"; // lyrics api
const SPOTIFY_API_URL = "https://api.spotify.com/v1"; // spotify api for an album cover
const spotifyToken = "BQCggeyfeCMIytD184eownm6y-vxAXuQ-rFABJy3M7psqTnZ5mp1vir9WuhAyA17bhYyKVRKoQEGqvbRbqj-qqSkYMMEK4Ln7SlLueBCMTwTIorCrdU";

const config = {
   headers: { Authorization: `Bearer ${spotifyToken}`},
} // OAuth Token

let lyricsData = [];

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
    res.render("index.ejs", {
        lyrics: lyricsData,
    });
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