import Swal from "sweetalert2";
import Post from "./Post";
import { AiOutlineClear } from "react-icons/ai";

const Feed = ({ clearAll, posts }) => {
  return (
    <>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      <div
        className="clear_box"
        onClick={() => {
          Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
          }).then((result) => {
            if (result.isConfirmed) {
              clearAll();
            }
          });
        }}
      >
        <AiOutlineClear className="clear_btn" />
        <p className="">Clear All</p>
      </div>
    </>
  );
};

export default Feed;
