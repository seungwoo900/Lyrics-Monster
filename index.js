// http://docs.lyricsovh.apiary.io/

import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://api.lyrics.ovh/v1";

app.use(bodyParser.urlencoded({extended: true}));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});