import React, { useEffect, useState, useRef, useCallback } from "react";
import { FaTimes } from "react-icons/fa";
import useAuth from "../hooks/useAuth";

function ImageGallery(props) {
  const { user, isLoggedIn: authLoggedIn, isAdmin: authIsAdmin } = useAuth();
  const [previewURLs, setPreviewURLs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [isMinor, setIsMinor] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const intervalRef = useRef(null);
  const fetchedOnce = useRef(false);
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(props.isLoggedIn) || Boolean(authLoggedIn));
  const [isAdmin, setIsAdmin] = useState(Boolean(props.isAdmin) || Boolean(authIsAdmin));

  /** FETCH IMAGES **/
  const fetchImages = useCallback(async () => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/images", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch images");
      const data = await res.json();

      // Don't revoke existing URLs here to avoid removing them too early
      const imageBlobs = await Promise.all(
        data.map(async (img) => {
          try {
            const blobRes = await fetch(`http://localhost:4000/api/images/${img._id}`, { credentials: "include" });
            if (!blobRes.ok) throw new Error("Image fetch failed");
            const blob = await blobRes.blob();
            return {
              id: img._id,
              url: URL.createObjectURL(blob),
              is_minor: img.is_minor || false,
            };
          } catch (err) {
            console.error(err);
            return null;
          }
        })
      );

      setPreviewURLs(imageBlobs.filter(Boolean));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
    return () => previewURLs.forEach((img) => URL.revokeObjectURL(img.url));
  }, [fetchImages, previewURLs]);

  useEffect(() => {
    setIsLoggedIn(Boolean(props.isLoggedIn) || Boolean(authLoggedIn));
    setIsAdmin(Boolean(props.isAdmin) || Boolean(authIsAdmin));
  }, [props.isLoggedIn, props.isAdmin, authLoggedIn, authIsAdmin]);

  /** FILTER MINORS OUT FOR GUESTS **/
  const visibleImages =
    isLoggedIn || isAdmin
      ? previewURLs
      : previewURLs.filter((img) => !img.is_minor);

  /** RESET INDEX ON CHANGE **/
  useEffect(() => setCurrentIndex(0), [isLoggedIn, isAdmin, visibleImages.length]);

  /** SLIDESHOW **/
  useEffect(() => {
    if (visibleImages.length <= 3) return;
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % visibleImages.length);
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, [visibleImages]);

  /** UPLOAD **/
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return alert("Select a file first");

    setIsUploading(true);

    const formData = new FormData();
    formData.append("image", uploadFile);
    formData.append("is_minor", isMinor ? "true" : "false");

    try {
      const res = await fetch("http://localhost:4000/api/images/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Upload failed");

      const newImage = await res.json();
      const blobRes = await fetch(`http://localhost:4000/api/images/${newImage.image._id}`, { credentials: "include" });
      const blob = await blobRes.blob();

      const objectUrl = URL.createObjectURL(blob);

      setPreviewURLs((prev) => [
        ...prev,
        {
          id: newImage.image._id,
          url: objectUrl,
          is_minor: newImage.image.is_minor,
        },
      ]);

      setShowUploadForm(false);
      setUploadFile(null);
      setIsMinor(false);
      alert("Uploaded!");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  /** DELETE (ADMIN ONLY) **/
  const handleRemove = async (id) => {
    if (!window.confirm("Delete this image?")) return;

    try {
      const res = await fetch(`http://localhost:4000/api/images/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Delete failed");

      setPreviewURLs((prev) =>
        prev.filter((img) => {
          if (img.id === id) URL.revokeObjectURL(img.url);
          return img.id !== id;
        })
      );
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  /** PICK 4 IMAGES **/
  const displayedImages = [
    visibleImages[currentIndex],
    visibleImages[(currentIndex + 1) % visibleImages.length],
    visibleImages[(currentIndex + 2) % visibleImages.length],
    visibleImages[(currentIndex + 3) % visibleImages.length],
  ].filter(Boolean);

  /** UPLOAD MODAL **/
  const UploadModal = () => (
    <div className="fixed inset-0 bg-gray-300/60 flex items-center justify-center z-50">
      <div className="bg-gray-100/80 p-6 rounded-lg shadow-lg backdrop-blur-md flex flex-col items-center max-w-sm w-full mx-4">
        <h2 className="text-lg font-semibold mb-4">Upload Image</h2>
        <form
          onSubmit={handleUpload}
          className="flex flex-col items-center space-y-4 w-full"
        >
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
            <span>Does this image contain a minor?</span>
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

  /** LOADING **/
  if (isLoading) {
    return (
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl mb-3 inline-block relative">
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
            <h2 className="text-5xl mb-3 inline-block relative">
              Community Photos
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-linear-to-r from-orange-500 to-orange-600"></div>
            </h2>
            <p className="text-xl text-gray-600 mt-6">Add your own photos!</p>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px]">
            <div className="text-gray-400 text-center py-8 border border-dashed border-gray-300 rounded-lg w-full">
              No images available
            </div>

            {isLoggedIn || isAdmin ? (
              <button
                onClick={() => setShowUploadForm(true)}
                className="mt-6 ml-auto bg-orange-500 hover:bg-orange-600 text-white text-sm px-3 py-2 rounded-lg transition-colors"
                style={{ alignSelf: "flex-end" }}
              >
                Upload
              </button>
            ) : null}

            {showUploadForm && <UploadModal />}
          </div>
        </div>
      </section>
    );
  }

  /** MAIN VIEW **/
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl mb-3 inline-block relative">
            Community Photos
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-linear-to-r from-orange-500 to-orange-600"></div>
          </h2>
          <p className="text-xl text-gray-600 mt-6">Add your own photos!</p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-8">

          {/* Upload button aligned right */}
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

          {/* IMAGE GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedImages.map((img, index) => (
              <div
                key={`${img.id}-${index}`}
                className="relative w-full h-64 overflow-hidden rounded-lg group"
                style={{
                  animation: "fadeIn 0.8s ease-in-out",
                  animationDelay: `${index * 0.15}s`,
                  animationFillMode: "backwards",
                }}
              >
                <img
                  src={img.url}
                  alt="Gallery"
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
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