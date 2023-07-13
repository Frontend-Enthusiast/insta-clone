import { Button } from '@material-ui/core';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react'
import { db, storage } from '../firebase-config';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import './ImageUpload.css';
const ImageUpload = ({ username }) => {
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState("");
    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }
    const handleUpload = () => {
        const storageRef = ref(storage, `images/${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on("state_changed",
            (snapshot) => {
                const progressPercent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgress(progressPercent);
            },
            (error) => {
                alert(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    setImage(url);
                    const postCollectionRef = collection(db, "posts");
                    addDoc(postCollectionRef,
                        {
                            timestamp: serverTimestamp(),
                            caption: caption,
                            Imageurl: url,
                            username: username
                        }
                    );
                    setCaption("");
                    setProgress(0);
                    setImage(null);
                });
            },
        );

    }
    return (
        <div className='imageupload'>
            <progress className='imageupload__progress' value={progress} max='100' />
            <input type='text' placeholder='Enter caption...' onChange={(e) => { setCaption(e.target.value) }} />
            <input type='file' onChange={handleChange} />
            <Button onClick={handleUpload}>Upload</Button>
        </div>
    )
}

export default ImageUpload