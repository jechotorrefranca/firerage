import React, { useState } from "react";
import { storage, db } from "../firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

const FileUploader = () => {
  const [bibleVerse, setBibleVerse] = useState("");
  const [date, setDate] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const ytLink = "https://www.youtube.com/watch?v=tkSQ9abv804";

  const deleteFolderContents = async (folderPath) => {
    try {
      const folderRef = ref(storage, folderPath);
      const { items } = await listAll(folderRef);
      if (items.length > 0) {
        await Promise.all(items.map((item) => deleteObject(item)));
        console.log(`Deleted all files in folder: ${folderPath}`);
      }
    } catch (error) {
      console.error("Error deleting existing folder contents:", error);
    }
  };

  const handleUpload = async () => {
    if (!bibleVerse || !date || !selectedFile) {
      alert("All fields are required.");
      return;
    }

    setIsUploading(true);
    const folderPath = `${date}`;
    await deleteFolderContents(folderPath);

    const storageRef = ref(storage, `${folderPath}/${selectedFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.error("Upload failed:", error);
        setMessage(`Upload failed: ${error.message}`);
        setIsUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        await setDoc(doc(db, "daily_schedules", date), {
          ytLink,
          bibleVerse,
          videoURL: downloadURL,
        });
        setMessage(`Upload successful!`);
        console.log(downloadURL);
        setProgress(0);
        setIsUploading(false);
        setBibleVerse("");
        setDate("");
        setSelectedFile(null);
      }
    );
  };

  return (
    <div>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <input
        type="text"
        placeholder="Bible Verse"
        value={bibleVerse}
        onChange={(e) => setBibleVerse(e.target.value)}
      />
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setSelectedFile(e.target.files[0])}
      />
      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? "Uploading..." : "Upload"}
      </button>
      {progress > 0 && (
        <div>
          <progress value={progress} max="100"></progress>
          <p>{Math.round(progress)}% uploaded</p>
        </div>
      )}
      <p>{message}</p>
    </div>
  );
};

export default FileUploader;
