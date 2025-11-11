import { useState } from "react";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import { saveImageData } from "../utils/saveToFirestore";
import axios from "axios";

export default function UploadPost() {
    const [file, setFile] = useState(null);
    const [caption, setCaption] = useState("");
    const [status, setStatus] = useState("");

    const handleUpload = async () => {
        if (!file || !caption) {
            setStatus("Please select an image and enter a caption.");
            return;
        }

        try {
            setStatus("Uploading to Cloudinary...");
            const imageUrl = await uploadToCloudinary(file);

            setStatus("Saving to Firestore...");
            await saveImageData(imageUrl, caption);

            setStatus("Posting to Instagram...");
            await axios.post("http://localhost:5002/api/instagram/post", {
                imageUrl,
                caption
            });

            setStatus("✅ Posted successfully!");
        } catch (error) {
            console.error(error);
            setStatus("❌ Something went wrong.");
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
            <h2>Upload & Post to Instagram</h2>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <input
                type="text"
                placeholder="Enter caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                style={{ marginTop: "10px", width: "100%" }}
            />
            <button
                onClick={handleUpload}
                style={{ marginTop: "10px", padding: "10px", width: "100%" }}
            >
                Upload & Post
            </button>
            <p style={{ marginTop: "10px", color: "gray" }}>{status}</p>
        </div>
    );
}