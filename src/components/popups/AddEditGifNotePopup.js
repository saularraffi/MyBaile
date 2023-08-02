import { React, useState, forwardRef, useImperativeHandle } from 'react'
import { Box, Modal, Typography, TextField, Button  } from '@mui/material';
import { postGifNote } from '../../services/gifyuApi';
import { putGifNote } from '../../services/gifyuApi';

const style = {
    root: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    },
    inputField: {
        width: "100%",
        marginTop: "10px",
        marginBottom: "10px"
    },
    buttons: {
        marginTop: "10px",
        marginLeft: "15px",
        float: "right",
        fontSize: "1rem"
    }
};

const AddGifNotePopup = forwardRef(({setSharedState, mode}, ref) => {
    const [id, setId] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [gifUrl, setGifUrl] = useState("");
    const [open, setOpen] = useState(false);
    
    const handleOpen = (id, description, category, gifUrl) => {
        setId(id);
        setDescription(description);
        setCategory(category);
        setGifUrl(gifUrl);
        setOpen(true);
    }

    const handleClose = () => {
        setDescription("");
        setCategory("");
        setGifUrl("");
        setOpen(false);
    }

    useImperativeHandle(ref, () => ({
        handleOpen,
    }));

    const addGifNote = () => {
        postGifNote(description, category, gifUrl).then(res => {
            setSharedState({
                id: res.data._id,
                action: "ADD",
                status: "SUCCESS"
            });
        }).catch(err => {
            setSharedState({
                error: err,
                action: "ADD",
                status: "FAILED"
            });
            console.log(err);
        })
        handleClose();
    }

    const updateGifNote = () => {
        putGifNote(id, description, category, gifUrl).then(res => {
            setSharedState({
                id: res.data._id,
                action: "UPDATE",
                status: "SUCCESS"
            });
        }).catch(err => {
            setSharedState({
                error: err,
                action: "UPDATE",
                status: "FAILED"
            });
            console.log(err);
        })
        handleClose();
    }

    const SubmitButton = () => {
        if (mode === "UPDATE") {
            return <Button onClick={updateGifNote} variant="contained" sx={style.buttons}>Update</Button>
        } else {
            return <Button onClick={addGifNote} variant="contained" sx={style.buttons}>Add</Button>
        }
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style.root}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Add GIF Note
                </Typography>
                <div>
                    <TextField 
                        onChange={(e) => setDescription(e.target.value)} 
                        value={description} 
                        label="Description" 
                        variant="standard"
                        autoComplete="off"
                        sx={style.inputField}>
                    </TextField>
                </div>
                <div>
                    <TextField
                        onChange={(e) => setCategory(e.target.value)} 
                        value={category} 
                        label="Category" 
                        variant="standard"
                        autoComplete="off"
                        sx={style.inputField}>
                    </TextField>
                </div>
                <div>
                    <TextField 
                        onChange={(e) => setGifUrl(e.target.value)} 
                        value={gifUrl} 
                        label="GIF URL" 
                        variant="standard"
                        autoComplete="off"
                        sx={style.inputField}>
                    </TextField>
                </div>
                <SubmitButton />
                <Button onClick={handleClose} sx={style.buttons}>Cancel</Button>
            </Box>
        </Modal>
    )
})

export default AddGifNotePopup;