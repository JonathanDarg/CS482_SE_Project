import React, { useEffect, useState, useRef, useCallback } from "react";
import { FaTimes } from "react-icons/fa";

function ImageGallery() {
  const [previewURLs, setPreviewURLs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [isMinor, setIsMinor] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const intervalRef = useRef(null);
  const fetchedOnce = useRef(false);

  // Fetch images once - optimized version
  const fetchImages = useCallback(async () => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/images");
      if (!res.ok) throw new Error("Failed to fetch images");

      const data = await res.json();

      // Clean up old URLs
      previewURLs.forEach((img) => URL.revokeObjectURL(img.url));

      // Fetch images in parallel for faster loading
      const imageBlobs = await Promise.all(
        data.map(async (img) => {
          try {
            const blobRes = await fetch(`http://localhost:4000/api/images/${img._id}`);
            if (!blobRes.ok) throw new Error(`Failed to fetch image ${img._id}`);
            const blob = await blobRes.blob();
            return {
              id: img._id,
              url: URL.createObjectURL(blob),
              is_minor: img.is_minor || false,
            };
          } catch (err) {
            console.error(`Error fetching image ${img._id}:`, err);
            return null;
          }
        })
      );

      // Filter out failed images
      const validImages = imageBlobs.filter(img => img !== null);
      setPreviewURLs(validImages);
    } catch (err) {
      console.error("Error fetching images:", err);
    } finally {
      setIsLoading(false); // Set loading false after fetch (success or error)
    }
  }, [previewURLs]);

  useEffect(() => {
    fetchImages();
    return () => {
      previewURLs.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, [fetchImages]);

  // Show all images if signed in or admin; otherwise hide minors
  const visibleImages =
    isSignedIn || isAdmin
      ? previewURLs
      : previewURLs.filter((img) => !img.is_minor);

  // Reset index when mode or images change
  useEffect(() => {
    setCurrentIndex(0);
  }, [isSignedIn, isAdmin, visibleImages.length]);

  // Slideshow rotation
  useEffect(() => {
    if (visibleImages.length <= 3) return;
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % visibleImages.length);
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, [visibleImages]);

  // Upload image
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return alert("❌ Please select a file to upload.");

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", uploadFile);
    formData.append("is_minor", isMinor ? "true" : "false");

    try {
      const res = await fetch("http://localhost:4000/api/images/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");

      const newImage = await res.json();
      const blobRes = await fetch(`http://localhost:4000/api/images/${newImage.image._id}`);
      const blob = await blobRes.blob();
      const objectUrl = URL.createObjectURL(blob);

      setPreviewURLs((prev) => [
        ...prev,
        { id: newImage.image._id, url: objectUrl, is_minor: newImage.image.is_minor },
      ]);
      setUploadFile(null);
      setIsMinor(false);
      setShowUploadForm(false);
      alert("✅ Image uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      alert("❌ Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  // Remove image (Admin only)
  const handleRemove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      const res = await fetch(`http://localhost:4000/api/images/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");

      setPreviewURLs((prev) => {
        const removed = prev.find((img) => img.id === id);
        if (removed) URL.revokeObjectURL(removed.url);
        return prev.filter((img) => img.id !== id);
      });
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ Failed to delete image.");
    }
  };

  // Get 4 images in a row for display
  const displayedImages = [
    visibleImages[currentIndex % visibleImages.length],
    visibleImages[(currentIndex + 1) % visibleImages.length],
    visibleImages[(currentIndex + 2) % visibleImages.length],
    visibleImages[(currentIndex + 3) % visibleImages.length],
  ].filter(Boolean); 

  // Guest / Signed In / Admin toggle
  const ActionButtons = () => {
    const mode = isAdmin ? "Admin" : isSignedIn ? "Signed In" : "Guest";

    const handleModeToggle = () => {
      if (!isSignedIn && !isAdmin) {
        setIsSignedIn(true);
        setIsAdmin(false);
      } else if (isSignedIn && !isAdmin) {
        setIsSignedIn(false);
        setIsAdmin(true);
      } else {
        setIsSignedIn(false);
        setIsAdmin(false);
      }
    };

    return (
      <div className="flex justify-between w-full mb-6"> 
        <button
          onClick={handleModeToggle}
          className="bg-gray-400 hover:bg-gray-500 text-white text-sm px-3 py-2 rounded-lg transition-colors"
        >
          {mode === "Guest"
            ? "View as Signed In"
            : mode === "Signed In"
            ? "View as Admin"
            : "View as Guest"}
        </button>

        {(isSignedIn || isAdmin) && (
          <button
            onClick={() => setShowUploadForm(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-3 py-2 rounded-lg transition-colors"
          >
            Upload
          </button>
        )}
      </div>
    );
  };

  // Upload modal
  const UploadModal = () => (
    <div className="fixed inset-0 bg-gray-300/60 flex items-center justify-center z-50">
      <div className="bg-gray-100/80 p-6 rounded-lg shadow-lg backdrop-blur-md flex flex-col items-center max-w-sm w-full mx-4">
        <h2 className="text-lg font-semibold mb-4">Upload Image</h2>
        <form onSubmit={handleUpload} className="flex flex-col items-center space-y-4 w-full">
          <label className="w-48 h-32 border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center text-gray-600 cursor-pointer hover:border-gray-500 transition-colors">
            {uploadFile ? (
              <span className="text-sm">{uploadFile.name}</span>
            ) : (
              <span className="text-sm">Click to Upload</span>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setUploadFile(e.target.files[0])}
            />
          </label>

          <label className="flex items-center space-x-2 text-gray-700">
            <input
              type="checkbox"
              checked={isMinor}
              onChange={(e) => setIsMinor(e.target.checked)}
            />
            <span>Does this Image contain a Minor?</span>
          </label>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={isUploading || !uploadFile} 
              className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowUploadForm(false);
                setUploadFile(null);
                setIsMinor(false);
              }}
              disabled={isUploading}
              className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Loading state
  if (isLoading) {
    return (
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl mb-3 inline-block relative">
              Community Photos
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-linear-to-r from-orange-500 to-orange-600"></div>
            </h2>
            <p className="text-xl text-gray-600 mt-6">
              Add your own photos!
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-2xl p-8 flex items-center justify-center min-h-[300px]">
            <div className="text-gray-400 text-xl">Loading images...</div>
          </div>
        </div>
      </section>
    );
  }

  // Empty gallery state (after loading)
  if (visibleImages.length === 0) {
    return (
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl mb-3 inline-block relative">
              Community Photos
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-linear-to-r from-orange-500 to-orange-600"></div>
            </h2>
            <p className="text-xl text-gray-600 mt-6">
              Add your own photos!
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px]">
            <div className="text-gray-400 text-center py-8 border border-dashed border-gray-300 rounded-lg w-full">
              No images available
            </div>
            <ActionButtons />
            {showUploadForm && <UploadModal />}
          </div>
        </div>
      </section>
    );
  }

  // Main gallery view
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl mb-3 inline-block relative">
            Community Photos
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-linear-to-r from-orange-500 to-orange-600"></div> 
          </h2>
          <p className="text-xl text-gray-600 mt-6">
            Add your own photos!
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-8">
          <ActionButtons />

          {/* Single row of 4 images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"> 
            {displayedImages.map((img, index) => (
              <div
                key={`${img.id}-${index}`}
                className="relative w-full h-64 overflow-hidden rounded-lg group" // group class for hover effects
                style={{
                  animation: 'fadeIn 0.8s ease-in-out',
                  animationDelay: `${index * 0.15}s`, // Staggered animation
                  animationFillMode: 'backwards'
                }}
              >
                <img
                  src={img.url}
                  alt={`Gallery ${index}`}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105" // Zoom on hover
                />
                {isAdmin && (
                  <button
                    onClick={() => handleRemove(img.id)}
                    className="absolute top-2 right-2 bg-black/50 hover:bg-red-600 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100" // Show on hover
                  >
                    <FaTimes size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {showUploadForm && <UploadModal />}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}

export default ImageGallery;