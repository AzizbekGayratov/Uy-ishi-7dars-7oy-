import Header from "./components/Header";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./components/Home";
import NewPost from "./components/NewPost";
import PostPage from "./components/PostPage";
import About from "./components/About";
import Missing from "./components/Missing";
import { Routes, useNavigate, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import toast, { Toaster } from "react-hot-toast";
const API_URL = "https://json-server-7-oy-7dars.onrender.com";

function App() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_URL}/posts`, {
          signal,
        });
        if (!response.ok) {
          const errMsg = await response.text();
          throw new Error("Network error fetching posts", errMsg);
        }

        const data = await response.json();
        if (!signal.aborted) {
          setPosts(data);
        }
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Aborted");
        } else {
          console.error(error);
        }
      }
    };
    fetchPosts();

    return () => {
      console.log("Cleanup");
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const filteredResults = posts.filter(
      (post) =>
        post.body.toLowerCase().includes(search.toLowerCase()) ||
        post.title.toLowerCase().includes(search.toLowerCase())
    );

    setSearchResults(filteredResults.reverse());
  }, [posts, search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    console.log(id);
    const datetime = format(new Date(), "MMMM dd, yyyy pp");
    const newPost = { id, title: postTitle, datetime, body: postBody };

    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      });

      if (response.ok) {
        const allPosts = [...posts, newPost];
        setPosts(allPosts);

        setPostTitle("");
        setPostBody("");
        navigate("/");

        toast.success("Post added successfully!", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } else {
        setPostTitle("");
        setPostBody("");
        navigate("/");

        toast.error("Something went wrong", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/posts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const postsList = posts.filter((post) => post.id !== id);
        setPosts(postsList);
        navigate("/");

        toast.success("Post deleted successfully!", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } else {
        toast.error("Something went wrong", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });

        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClearAll = async () => {
    try {
      for (let post of posts) {
        await fetch(`${API_URL}/posts/${post.id}`, {
          method: "DELETE",
        });
        setPosts([]);
      }

      toast.success("All posts deleted!", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      navigate("/");
    } catch (error) {}
    setPosts([]);
    navigate("/");
  };

  return (
    <div className="App">
      <Toaster position="top-right" />
      <Header title="React JS Blog" />
      <Nav search={search} setSearch={setSearch} />
      <Routes>
        <Route
          path="/"
          element={<Home clearAll={handleClearAll} posts={searchResults} />}
        />
        <Route
          path="/post"
          element={
            <NewPost
              handleSubmit={handleSubmit}
              postTitle={postTitle}
              setPostTitle={setPostTitle}
              postBody={postBody}
              setPostBody={setPostBody}
            />
          }
        />
        <Route
          path="/post/:id"
          element={<PostPage posts={posts} handleDelete={handleDelete} />}
        />
        <Route path="/about" element={<About />} />
        <Route path="*" component={<Missing />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
