import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addComments } from "../../API/Comments/addComments";
import { toast } from "react-toastify";
import { useContext } from "react";
import { TokenContext } from "../Context/TokenContext";

export default function CreateComment({ postId }) {
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();
  const { userData } = useContext(TokenContext);

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => addComments(data),
    onSuccess: () => {
      toast.success("Comment added successfully");
      setContent("");
      queryClient.invalidateQueries({
        queryKey: ["Comments", postId],
      });
      queryClient.invalidateQueries({
        queryKey: ["Profile"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["Allposts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["SinglePost"],
        exact: false,
      });
    },
    onError: (error) => {
      console.error("Error adding comment:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to add comment";
      toast.error(errorMessage);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.warning("Please write a comment");
      return;
    }
    if (!postId) {
      toast.error("Post ID is missing");
      return;
    }
    mutate({
      content: content.trim(),
      post: postId,
    });
  };

  return (
    <div className="px-5 pt-4 pb-3 border-t border-gray-700 bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center"
      >
        <div className="flex-1 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
            <img
              src={
                userData?.photo
                  ? userData.photo
                  : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              }
              alt="user"
              className="object-cover w-full h-full"
              onError={(e) => {
                e.target.src =
                  "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";
              }}
            />
          </div>

          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 bg-gray-700 text-white rounded-full px-4 py-2 border border-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
            disabled={isPending}
          />
        </div>

        <button
          type="submit"
          disabled={!content.trim() || isPending}
          className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-full transition-colors font-medium"
        >
          {isPending ? "Adding..." : "Add"}
        </button>
      </form>
    </div>
  );
}
