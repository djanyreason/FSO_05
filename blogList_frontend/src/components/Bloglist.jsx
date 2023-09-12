import Blog from './Blog';

const Bloglist = ({ blogs, addLike, username, remove }) => {
  if(!blogs) return (<div></div>);

  return (
    <div>
      {blogs
        .sort((a, b) => b.likes-a.likes)
        .map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            like={() => addLike(blog.id)}
            deleteBlog={username === blog.user.username ? () => remove(blog.id) : null}
          />
        )}
    </div>
  );
};

export default Bloglist;