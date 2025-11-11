export async function uploadToCloudinary(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_gramora"); // hardcoded since it's static

    const cloudName = "dja37lluh"; // hardcoded since it's static
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const res = await fetch(uploadUrl, {
        method: "POST",
        body: formData
    });

    if (!res.ok) {
        throw new Error("Cloudinary upload failed");
    }

    const data = await res.json();
    return data.secure_url;
}