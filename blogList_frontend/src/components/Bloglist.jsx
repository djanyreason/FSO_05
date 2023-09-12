import Blog from './Blog';

const Bloglist = ({ blogs, addLike }) => {
  if(!blogs) return (<div></div>);

  return (
    <div>
      {blogs
        .sort((a, b) => b.likes-a.likes)
        .map(blog =>
          <Blog key={blog.id} blog={blog} like={() => addLike(blog.id)} />
        )}
    </div>
  );
};

export default Bloglist;