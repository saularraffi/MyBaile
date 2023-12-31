import {
    React,
    useState,
    forwardRef,
    useImperativeHandle,
    useEffect,
} from "react";
import {
    Box,
    Modal,
    Typography,
    TextField,
    Button,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    Input,
} from "@mui/material";
import { postDanceNote, putDanceNote } from "../../services/danceNotesApi";
import { postVideo } from "../../services/videoApi";
import axios from "axios";

const style = {
    root: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 500,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
    },
    inputField: {
        width: "100%",
        marginTop: "10px",
        marginBottom: "10px",
    },
    buttons: {
        marginTop: "10px",
        marginLeft: "15px",
        float: "right",
        fontSize: "1rem",
    },
};

const AddDanceNotePopup = forwardRef(({ setSharedPopupState, mode }, ref) => {
    const [id, setId] = useState("");
    const [noteText, setNoteText] = useState("");
    const [category, setCategory] = useState("");
    const [selectedVideoFile, setSelectedVideoFile] = useState(null);
    const [open, setOpen] = useState(false);

    const categories = localStorage.getItem("categories").split(",");

    const handleOpen = (id, noteText, category) => {
        setId(id);
        setNoteText(!noteText ? "" : noteText);
        setCategory(category);
        setOpen(true);
    };

    const handleClose = () => {
        setNoteText("");
        setCategory("");
        setSelectedVideoFile(null);
        setOpen(false);
    };

    const handleCategorySelection = (event) => {
        setCategory(event.target.value);
    };

    useImperativeHandle(ref, () => ({
        handleOpen,
    }));

    const addDanceNote = () => {
        postDanceNote(noteText.trim(), category.trim())
            .then((res) => {
                postVideo(res.data._id, selectedVideoFile)
                    .then((res) => console.log(res))
                    .catch((err) => console.log(err));

                setSharedPopupState({
                    id: res.data._id,
                    action: "ADD",
                    status: "SUCCESS",
                });
            })
            .catch((err) => {
                setSharedPopupState({
                    error: err,
                    action: "ADD",
                    status: "FAILED",
                });
                console.log(err);
            });
        handleClose();
    };

    const updateDanceNote = (e) => {
        putDanceNote(id, noteText.trim(), category.trim())
            .then((res) => {
                setSharedPopupState({
                    id: res.data._id,
                    action: "EDIT",
                    status: "SUCCESS",
                });
            })
            .catch((err) => {
                setSharedPopupState({
                    error: err,
                    action: "EDIT",
                    status: "FAILED",
                });
                console.log(err);
            });
        handleClose();
    };

    const SubmitButton = () => {
        if (mode === "UPDATE") {
            return (
                <Button
                    onClick={updateDanceNote}
                    variant="contained"
                    sx={style.buttons}
                >
                    Update
                </Button>
            );
        } else {
            return (
                <Button
                    onClick={addDanceNote}
                    variant="contained"
                    sx={style.buttons}
                    disabled={!selectedVideoFile || !category}
                >
                    Add
                </Button>
            );
        }
    };

    const handleFileChange = (event) => {
        setSelectedVideoFile(event.target.files[0]);
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-noteText"
        >
            <Box sx={style.root}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Add Dance Note
                </Typography>

                <TextField
                    defaultValue={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    value={noteText}
                    label="Note Text"
                    variant="standard"
                    autoComplete="off"
                    sx={style.inputField}
                ></TextField>

                <FormControl variant="standard" sx={{ width: "50%" }}>
                    <InputLabel id="demo-simple-select-label">
                        Category
                    </InputLabel>
                    <Select
                        defaultValue={category}
                        value={category}
                        label="Category"
                        onChange={handleCategorySelection}
                        renderValue={() => <em>{category}</em>}
                    >
                        {categories.map((categoryName, index) => {
                            return (
                                <MenuItem
                                    key={`${index}-${categoryName}`}
                                    value={categoryName}
                                >
                                    {categoryName}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>

                <Box sx={{ marginTop: "30px", display: "flex" }}>
                    <Button
                        variant="contained"
                        component="label"
                        disabled={mode === "UPDATE"}
                        sx={{ textTransform: "unset" }}
                    >
                        Upload Video
                        <input type="file" onChange={handleFileChange} hidden />
                    </Button>
                    <Typography sx={{ marginLeft: "15px" }}>
                        {selectedVideoFile?.name}
                    </Typography>
                </Box>

                <SubmitButton />

                <Button onClick={handleClose} sx={style.buttons}>
                    Cancel
                </Button>
            </Box>
        </Modal>
    );
});

export default AddDanceNotePopup;
