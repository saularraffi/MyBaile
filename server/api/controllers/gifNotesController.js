const express = require("express")
const gifNotesService = require("../services/gifNotesService.js")
const router = express.Router()

const endpoint = "/api/gifnotes"

router.get(endpoint, async (req, res) => {
    gifNotesService.getGifNotes()
    .then(gifNotes => {
        res.status(200);
        res.send(gifNotes);
    })
    .catch(err => {
        console.log(`[-] Error fetching GIF note\n${err}`);
        res.status(500);
        res.send("Error fetching GIF notes");
    })
})

router.post(endpoint, async (req, res) => {
    const note = req.query.note;
    const category = req.query.category;
    const gifUrl = req.query.gifUrl;

    gifNotesService.saveGifNote(note, category, gifUrl)
    .then(gifNote => {
        res.status(200);
        res.send(gifNote);
    })
    .catch(err => {
        console.log(`[-] Error saving GIF note\n${err}`);
        res.status(500);
        res.send("Error saving GIF note");
    });
})

module.exports = router