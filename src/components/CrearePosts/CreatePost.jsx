import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../../API/Posts/CreatePosts";
import { useState } from "react";
import { toast } from "react-toastify";

export default function CreatePost() {
  const [body, setBody] = useState("");
  const [img, setImg] = useState("");
  const [imgSrc, setImgSrc] = useState("");
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: (data) => createPost(data),
    onSuccess: () => {
      toast.success("Post Added Successfully");
      queryClient.invalidateQueries({
        queryKey: ["Profile"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["Allposts"],
      });
      setBody("");
      setImg("");
      setImgSrc("");
    },
  });

  function handleAddPost() {
    const formData = new FormData();

    if (body) {
      formData.append("body", body);
    }
    if (img) {
      formData.append("image", img);
    }
    mutate(formData);
  }

  function handleChange(e) {
    const file = e.target.files[0];
    setImg(file);
    setImgSrc(URL.createObjectURL(file));
  }

  return (
    <>
      {isPending && toast.info("Adding Post...")}
      <div className="w-full max-w-3xl bg-gray-800 rounded-2xl shadow-xl my-8 border border-gray-700 overflow-hidden">
        <div className="p-4">
          <textarea
            className="w-full bg-gray-700 text-white rounded-xl p-4 resize-none border border-gray-600 focus:outline-none focus:border-blue-500"
            rows="4"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What's on your mind?"
          ></textarea>

          {imgSrc && (
            <div className="mt-3 relative">
              <img
                src={imgSrc}
                alt="preview"
                className="w-full h-48 object-cover rounded-xl"
              />
              <button
                onClick={() => {
                  setImg("");
                  setImgSrc("");
                }}
                className="absolute top-2 right-2 bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-700 transition"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex justify-between items-center mt-4">
            <label className="cursor-pointer">
              <input
                onChange={handleChange}
                type="file"
                accept="image/*"
                className="hidden"
              />
              <div className="text-gray-400 hover:text-blue-400 transition p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.44 11.05l-9.19 9.19a5.5 5.5 0 01-7.78-7.78l9.19-9.19a3.5 3.5 0 015 5l-9.2 9.19a1.5 1.5 0 01-2.12-2.12l8.13-8.12"
                  />
                </svg>
              </div>
            </label>

            <button
              onClick={handleAddPost}
              disabled={!body.trim() && !img}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-full px-6 py-2 transition cursor-pointer"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
