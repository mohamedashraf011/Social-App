import React, { useState } from "react";
import imagePost from "../../assets/image post.jpg";
import {
  FaHeart,
  FaRegHeart,
  FaRegCommentDots,
  FaShare,
  FaTrash,
} from "react-icons/fa";
import CommentItem from "../CommentItem/CommentItem";
import CreateComment from "../CreateComment/CreateComment";

export default function SinglePost({
  post,
  alwaysShowComments = false,
  showDeleteButton = false,
  onDelete,
}) {
  const [showComments, setShowComments] = useState(alwaysShowComments);
  const [liked, setLiked] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const toggleLike = () => setLiked((prev) => !prev);
  const toggleComments = () => setShowComments((prev) => !prev);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete(post._id);
    }
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="w-[50%] bg-gray-800 rounded-2xl shadow-xl my-8 border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img
              src={
                post?.user?.photo
                  ? post.user.photo
                  : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              }
              alt="user"
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <p className="font-semibold text-lg text-white">
              {post?.user?.name}
            </p>
            <p className="text-sm text-gray-400">{post?.createdAt}</p>
          </div>
        </div>
        {showDeleteButton && (
          <button
            onClick={handleDeleteClick}
            className="p-2 rounded-full hover:bg-red-900/30 transition-colors group"
            title="Delete Post"
          >
            <FaTrash className="text-red-500 text-lg group-hover:text-red-400 transition-colors cursor-pointer" />
          </button>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="mb-3 text-gray-200 leading-relaxed">{post?.body}</p>
        <img
          src={post?.image || imagePost}
          alt="post"
          className="rounded-xl mb-4 w-full object-cover"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center py-4 px-6 text-gray-300">
        <button
          className="flex items-center gap-2 hover:text-red-500 transition cursor-pointer"
          onClick={toggleLike}
        >
          {liked ? (
            <FaHeart className="text-red-500 text-lg" />
          ) : (
            <FaRegHeart className="text-lg" />
          )}
          <span>Like</span>
        </button>

        <button
          className="flex items-center gap-2 hover:text-blue-400 transition cursor-pointer"
          onClick={toggleComments}
        >
          <FaRegCommentDots className="text-lg" />
          <span>Comment</span>
        </button>

        <button className="flex items-center gap-2 hover:text-green-400 transition cursor-pointer">
          <FaShare className="text-lg" />
          <span>Share</span>
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <>
          <CreateComment postId={post._id} />
          <CommentItem comments={post.comments} postId={post._id} />
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 border border-gray-700 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this post? This action cannot be
              undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelDelete}
                className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
