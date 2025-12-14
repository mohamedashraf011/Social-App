import { useContext } from "react";
import { TokenContext } from "../Context/TokenContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Loader from "../Loader/Loader";
import SinglePost from "../SinglePost/SinglePost";
import { getUserPost } from "../../API/Posts/getUserPost";
import CreatePost from "../CrearePosts/CreatePost";
import { deletePost } from "../../API/Posts/deletePost";
import { toast } from "react-toastify";

export default function Profile() {
  const { userData } = useContext(TokenContext);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["Profile", userData?._id],
    queryFn: () => getUserPost(userData?._id),
    enabled: !!userData?._id,
  });

  const { mutate: handleDeletePost, isPending: isDeleting } = useMutation({
    mutationFn: (postId) => deletePost(postId),
    onSuccess: () => {
      toast.success("Post Deleted Successfully");
      queryClient.invalidateQueries({
        queryKey: ["Profile", userData?._id],
      });
      queryClient.invalidateQueries({
        queryKey: ["Allposts"],
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete post");
    },
  });

  if (isLoading) return <Loader />;

  if (error)
    return <div className="text-white text-center mt-10">{error.message}</div>;

  const posts = data?.posts || [];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
            <div className="shrink-0">
              <img
                className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-gray-700 object-cover"
                src={
                  userData?.photo
                    ? userData.photo
                    : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                }
                alt="Profile"
                onError={(e) => {
                  e.target.src =
                    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";
                }}
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">
                {userData?.name || "User"}
              </h2>
              <p className="text-gray-400 text-lg mb-4">{userData?.email}</p>

              <div className="flex items-center gap-6 justify-center md:justify-start">
                <div className="text-center">
                  <p className="text-2xl font-semibold text-white">
                    {posts.length}
                  </p>
                  <p className="text-sm text-gray-400">Posts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="min-h-screen py-10 px-4 text-white bg-gray-900 flex flex-col items-center">
        <CreatePost />

        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="w-full flex justify-center">
              <SinglePost
                post={post}
                alwaysShowComments={true}
                showDeleteButton={true}
                onDelete={handleDeletePost}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl mb-4">No posts yet</p>
            <p className="text-gray-500">Start sharing your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
}
