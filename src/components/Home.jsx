import Feed from "./Feed";

const Home = ({ clearAll, posts }) => {
  return (
    <main className="Home">
      {posts.length ? (
        <Feed clearAll={clearAll} posts={posts} />
      ) : (
        <p style={{ marginTop: "2rem" }}>No posts to display.</p>
      )}
    </main>
  );
};

export default Home;
