import React, { useEffect, useState, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import useAuth from "../hooks/useAuth";

function ImageGallery(props) {
  const { user, isLoggedIn: authLoggedIn, isAdmin: authIsAdmin } = useAuth();

  const [previewURLs, setPreviewURLs] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [isMinor, setIsMinor] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fileInputRef = useRef(null);

  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(props.isLoggedIn) || Boolean(authLoggedIn));
  const [isAdmin, setIsAdmin] = useState(Boolean(props.isAdmin) || Boolean(authIsAdmin));

  /** FETCH ALL IMAGES **/
  const fetchImages = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/images", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch images");
      const data = await res.json();

      const images = data.map(img => ({
        id: img._id,
        url: `http://localhost:4000/api/images/${img._id}`,
        is_minor: img.is_minor || false,
      }));

      setPreviewURLs(images);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching images:", err);
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchImages(); }, []);

  useEffect(() => {
    setIsLoggedIn(Boolean(props.isLoggedIn) || Boolean(authLoggedIn));
    setIsAdmin(Boolean(props.isAdmin) || Boolean(authIsAdmin));
  }, [props.isLoggedIn, props.isAdmin, authLoggedIn, authIsAdmin]);

  const visibleImages = isLoggedIn || isAdmin
    ? previewURLs
    : previewURLs.filter((img) => !img.is_minor);

  /** FILE HANDLING **/
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setUploadFile(file);
    e.target.value = null;
  };

  /** UPLOAD **/
  const handleUpload = async () => {
    if (!uploadFile) return alert("Select a file first");

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", uploadFile);
      formData.append("is_minor", isMinor ? "true" : "false");

      const res = await fetch("http://localhost:4000/api/images/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Upload failed");
      }

      const { image: newImage } = await res.json();
      const objectUrl = `http://localhost:4000/api/images/${newImage._id}`;

      setPreviewURLs(prev => [
        { id: newImage._id, url: objectUrl, is_minor: newImage.is_minor },
        ...prev,
      ]);

      setUploadFile(null);
      setIsMinor(false);
      setShowUploadForm(false);
      alert("Image uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      alert(`Upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  /** DELETE **/
  const handleRemove = async (id) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      const res = await fetch(`http://localhost:4000/api/images/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Delete failed");
      setPreviewURLs(prev => prev.filter(img => img.id !== id));
      alert("Image deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete image");
    }
  };

  /** LOADING **/
  if (isLoading) {
    return (
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl mb-3 relative inline-block">
              Community Photos
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-linear-to-r from-orange-500 to-orange-600"></div>
            </h2>
            <p className="text-xl text-gray-600 mt-6">Add your own photos!</p>
          </div>
          <div className="bg-white shadow-lg rounded-2xl p-8 flex items-center justify-center min-h-[300px]">
            <div className="text-gray-400 text-xl">Loading images...</div>
          </div>
        </div>
      </section>
    );
  }

  /** EMPTY **/
  if (visibleImages.length === 0) {
    return (
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl mb-3 relative inline-block">
              Community Photos
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-linear-to-r from-orange-500 to-orange-600"></div>
            </h2>
            <p className="text-xl text-gray-600 mt-6">Add your own photos!</p>
          </div>
          <div className="bg-white shadow-lg rounded-2xl p-8 flex items-center justify-center min-h-[300px]">
            <div className="text-gray-400 text-xl">No images available.</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6">
      <style jsx>{`
        @keyframes slideLoop {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl mb-3 relative inline-block">
            Community Photos
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-linear-to-r from-orange-500 to-orange-600"></div>
          </h2>
          <p className="text-xl text-gray-600 mt-6">Add your own photos!</p>
        </div>

        {(isLoggedIn || isAdmin) && (
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setShowUploadForm(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-3 py-2 rounded-lg transition-colors"
            >
              Upload
            </button>
          </div>
        )}

        {/* LOOPING SLIDER */}
        <div className="overflow-hidden relative w-full">
          <div
            className="flex gap-6"
            style={{
              width: `${visibleImages.length * 2 * 256 + (visibleImages.length * 2 - 1) * 24}px`,
              animation: `slideLoop ${visibleImages.length * 20}s linear infinite`,
            }}
          >
            {[...visibleImages, ...visibleImages].map((img, idx) => (
              <div
                key={`${img.id}-${idx}`}
                className="group shrink-0 w-64 h-64 rounded-lg overflow-hidden relative"
              >
                <img
                  src={img.url}
                  alt="Gallery"
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out hover:scale-105"
                />
                {isAdmin && (
                  <button
                    onClick={() => handleRemove(img.id)}
                    className="absolute top-2 right-2 bg-black/50 hover:bg-red-600 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                  >
                    <FaTimes size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* UPLOAD MODAL */}
        {showUploadForm && (
          <div className="fixed inset-0 bg-gray-300/60 flex items-center justify-center z-50">
            <div className="bg-gray-100/90 p-6 rounded-lg shadow-lg backdrop-blur-md flex flex-col items-center max-w-sm w-full mx-4">
              <h2 className="text-lg font-semibold mb-4">Upload Image</h2>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading}
                id="file-upload-input"
              />
              <label
                htmlFor="file-upload-input"
                className={`w-48 h-32 border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center text-gray-600 cursor-pointer hover:border-gray-500 ${
                  isUploading ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                {uploadFile ? uploadFile.name : "Click to Upload"}
              </label>

              <label className="flex items-center space-x-2 text-gray-700 mt-2">
                <input
                  type="checkbox"
                  checked={isMinor}
                  onChange={(e) => setIsMinor(e.target.checked)}
                  disabled={isUploading}
                />
                <span>Contains a minor?</span>
              </label>

              <div className="flex space-x-3 mt-4">
                <button
                  onClick={handleUpload}
                  disabled={isUploading || !uploadFile}
                  className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-4 py-2 rounded-lg"
                >
                  {isUploading ? "Uploading..." : "Upload"}
                </button>
                <button
                  onClick={() => {
                    setShowUploadForm(false);
                    setUploadFile(null);
                    setIsMinor(false);
                  }}
                  disabled={isUploading}
                  className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default ImageGallery;
