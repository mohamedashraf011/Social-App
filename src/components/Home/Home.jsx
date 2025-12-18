import { useQuery } from "@tanstack/react-query";
import Loader from "../Loader/Loader";
import SinglePost from "../SinglePost/SinglePost";
import { Link } from "react-router-dom";
import { getAllPosts } from "../../API/Posts/Allposts";
import CreatePost from "../CrearePosts/CreatePost";

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["Allposts"],
    queryFn: getAllPosts,
    select: (data) => data?.posts,
  });

  if (isLoading) return <Loader />;

  if (error)
    return <div className="text-white text-center mt-10">{error.message}</div>;

  return (
    <div className="min-h-screen py-10 px-4 text-white bg-gray-900 flex flex-col items-center shadow-2xl">
      <CreatePost />

      {data?.map((post) => (
        <Link
          key={post._id}
          to={`postDetails/${post._id}`}
          className="w-full flex justify-center"
        >
          <SinglePost post={post} />
        </Link>
      ))}
    </div>
  );
}
