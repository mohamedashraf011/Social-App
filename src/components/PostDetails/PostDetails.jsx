import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Loader from "../Loader/Loader";
import SinglePost from "../SinglePost/SinglePost";
import CommentItem from "../CommentItem/CommentItem";
import { getPostDetails } from "../../API/Posts/SinglePost";

export default function PostDetails() {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["SinglePost", id],
    queryFn: () => getPostDetails(id),
    select: (data) => data?.post,
  });

  if (isLoading) return <Loader />;

  if (error)
    return (
      <div className="text-white text-center mt-10">
        {error.message}
      </div>
    );

  const post = data;

  return (
    <div className="min-h-screen py-10 px-4 text-white bg-gray-900 flex flex-col items-center">
      <SinglePost post={post} alwaysShowComments={true} />
    </div>
  );
}
