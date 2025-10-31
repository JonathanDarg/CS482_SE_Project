import React, { useEffect, useState } from "react";

function ImageGallery() {
  const [previewURLs, setPreviewURLs] = useState([]);

  // Fetch latest 3 images
  useEffect(() => {
    fetch("http://localhost:4000/api/images")
      .then(res => res.json())
      .then(async (data) => {
        const recent = data.slice(0, 3); // newest 3
        const imageBlobs = await Promise.all(
          recent.map(async (img) => {
            const blob = await fetch(`http://localhost:4000/api/images/${img._id}`)
              .then(r => r.blob());
            return URL.createObjectURL(blob);
          })
        );
        setPreviewURLs(imageBlobs);
      })
      .catch(err => console.error("Error fetching images:", err));
  }, []);

  // Upload image
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("http://localhost:4000/api/images/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const newImage = await res.json();
      const blob = await fetch(`http://localhost:4000/api/images/${newImage.image._id}`)
        .then(r => r.blob());

      setPreviewURLs(prev => [URL.createObjectURL(blob), ...prev].slice(0, 3));
      alert("✅ Image uploaded successfully!");
    } else {
      alert("❌ Failed to upload image.");
    }
  };

  return (
    <div className="w-[30%] bg-white shadow-lg rounded-2xl p-4 flex flex-col items-center">
      <h3 className="text-xl font-semibold mb-4">Gallery</h3>

      <div className="grid grid-cols-1 gap-4 w-full">
        {previewURLs.length > 0 ? (
          previewURLs.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Gallery ${index + 1}`}
              className="rounded-lg shadow-md w-full h-40 object-cover"
            />
          ))
        ) : (
          <div className="text-gray-400 text-center py-8 border border-dashed border-gray-300 rounded-lg">
            No images yet
          </div>
        )}
      </div>

      <label className="mt-4 bg-orange-500 hover:bg-orange-600 text-white text-sm px-3 py-2 rounded-lg cursor-pointer">
        Upload Image
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
      </label>
    </div>
  );
}

export default ImageGallery;
