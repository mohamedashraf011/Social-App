import axios from "axios";
const token = localStorage.getItem("token");
export async function deletePost(postId) {
  const { data } = await axios.delete(
    `https://linked-posts.routemisr.com/posts/${postId}`,
    {
      headers: {
        token: token,
      },
    }
  );
  return data;
}
