import { useQuery } from "@tanstack/react-query";
import person from "../../assets/image comment.png";
import { getPostComments } from "../../API/Comments/getPostComments";

export default function CommentItem({ comments, postId }) {
  const { data: fetchedComments, isLoading } = useQuery({
    queryKey: ["Comments", postId],
    queryFn: () => getPostComments(postId),
    select: (data) => data?.comments,
    enabled: !!postId && !comments,
  });

  const displayComments = comments || fetchedComments || [];

  if (isLoading) {
    return (
      <div className="px-5 pb-5 mt-3 border-t border-gray-700 pt-4 rounded-b-2xl bg-gray-900">
        <p className="text-gray-400 text-sm text-center py-3">
          Loading comments...
        </p>
      </div>
    );
  }

  return (
    <div className="px-5 pb-5 mt-3 border-t border-gray-700 pt-4 rounded-b-2xl bg-gray-900">
      {displayComments && displayComments.length > 0 ? (
        displayComments.map((comment, idx) => (
          <div
            key={comment._id || idx}
            className="flex items-start gap-3 mb-3 p-3 rounded-2xl shadow-sm hover:shadow-md transition bg-gray-700"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden bg-gray-600 shrink-0">
              <img
                src={
                  comment?.commentCreator?.photo &&
                  comment.commentCreator.photo.trim() !== ""
                    ? comment.commentCreator.photo
                    : person
                }
                alt="commenter"
                className="object-cover w-full h-full"
                onError={(e) => {
                  e.target.src = person;
                }}
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-md text-white">
                  {comment?.commentCreator?.name || "Unknown"}
                </p>
                <span className="text-xs text-gray-400">
                  {comment?.createdAt?.slice(0, 10) || ""}
                </span>
              </div>

              <p className="text-gray-200 text-sm mt-1 rounded-2xl p-3 leading-relaxed bg-gray-600">
                {comment?.content}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-sm text-center py-3">
          No comments yet.
        </p>
      )}
    </div>
  );
}
