import Feed from "./Feed";

const Home = ({ onLoad, clearAll, posts }) => {
  return (
    <>
      <main className="Home">
        {onLoad && (
          <div className="loader_box">
            <div className="bouncing-dots">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        )}
        {!onLoad && Boolean(posts.length) && (
          <Feed clearAll={clearAll} posts={posts} />
        )}
        {!onLoad && !posts.length && (
          <p style={{ marginTop: "2rem" }}>No posts to display.</p>
        )}
      </main>
    </>
  );
};

export default Home;
