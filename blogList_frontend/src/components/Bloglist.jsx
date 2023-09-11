import Blog from './Blog';

const Bloglist = ({ blogs, user, doLogout }) => {
  if(!user) return (<div></div>);

  return (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in<button onClick={doLogout}>logout</button></p>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  );
};

export default Bloglist;