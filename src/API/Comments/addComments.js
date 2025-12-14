import axios from "axios";

export async function addComments(obj) {
  const token = localStorage.getItem("token");
  const { data } = await axios.post(
    "https://linked-posts.routemisr.com/comments",
    obj,
    {
      headers: {
        token: token,
      },
    }
  );
  return data;
}
