import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

function ImageGallery() {
  const [previewURLs, setPreviewURLs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // Fetch all images
  useEffect(() => {
    fetch("http://localhost:4000/api/images")
      .then((res) => res.json())
      .then(async (data) => {
        const imageBlobs = await Promise.all(
          data.map(async (img) => {
            const blob = await fetch(`http://localhost:4000/api/images/${img._id}`).then((r) =>
              r.blob()
            );
            return { id: img._id, url: URL.createObjectURL(blob) };
          })
        );
        setPreviewURLs(imageBlobs);
      })
      .catch((err) => console.error("Error fetching images:", err));
  }, []);

  // Rotate images
  useEffect(() => {
    if (previewURLs.length === 0) return;

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % previewURLs.length);
        setFade(true);
      }, 500);
    }, 10000);

    return () => clearInterval(interval);
  }, [previewURLs]);

  // Upload image
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch("http://localhost:4000/api/images/upload", { method: "POST", body: formData });
    if (res.ok) {
      const newImage = await res.json();
      const blob = await fetch(`http://localhost:4000/api/images/${newImage.image._id}`).then(r => r.blob());
      setPreviewURLs(prev => [...prev, { id: newImage.image._id, url: URL.createObjectURL(blob) }]);
      alert("✅ Image uploaded successfully!");
    } else alert("❌ Failed to upload image.");
  };

  // Remove image
  const handleRemove = async (id) => {
    try {
      await fetch(`http://localhost:4000/api/images/${id}`, { method: "DELETE" });
      setPreviewURLs(prev => prev.filter(img => img.id !== id));
      alert("🗑️ Image removed successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete image.");
    }
  };

  if (previewURLs.length === 0) {
    return (
      <div className="bg-white shadow-lg rounded-2xl p-4 flex flex-col items-center justify-center max-w-[400px] h-auto">
        <div className="text-gray-400 text-center py-8 border border-dashed border-gray-300 rounded-lg w-full">
          No images yet
        </div>
        <label className="mt-4 bg-orange-500 hover:bg-orange-600 text-white text-sm px-3 py-2 rounded-lg cursor-pointer">
          Upload Image
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </label>
      </div>
    );
  }

  const topImages = [
    previewURLs[currentIndex % previewURLs.length],
    previewURLs[(currentIndex + 1) % previewURLs.length],
  ];
  const bottomImage = previewURLs[(currentIndex + 2) % previewURLs.length];

  return (
    <div className="bg-white shadow-lg rounded-2xl p-4 flex flex-col max-w-[400px] h-auto">
      <div className="flex flex-col gap-2">
        {/* Top two images */}
        <div className="grid grid-cols-2 gap-2">
          {topImages.map((img, index) => (
            <div key={img.id} className="relative w-full h-40 overflow-hidden rounded-lg">
              <img
                src={img.url}
                alt={`Gallery top ${index + 1}`}
                className={`w-full h-full object-cover transition-opacity duration-500 ${
                  fade ? "opacity-100" : "opacity-0"
                }`}
              />
              <button
                onClick={() => handleRemove(img.id)}
                className="absolute top-1 right-1 bg-black/60 hover:bg-red-600 text-white p-1 rounded-full"
                title="Remove image"
              >
                <FaTimes />
              </button>
            </div>
          ))}
        </div>

        {/* Bottom large image */}
        <div className="relative w-full h-56 overflow-hidden rounded-lg">
          <img
            src={bottomImage.url}
            alt="Gallery bottom"
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              fade ? "opacity-100" : "opacity-0"
            }`}
          />
          <button
            onClick={() => handleRemove(bottomImage.id)}
            className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white p-1 rounded-full"
            title="Remove image"
          >
            <FaTimes />
          </button>
        </div>
      </div>

      <label className="mt-4 bg-orange-500 hover:bg-orange-600 text-white text-sm px-3 py-2 rounded-lg cursor-pointer self-center">
        Upload Image
        <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
      </label>
    </div>
  );
}

export default ImageGallery;
