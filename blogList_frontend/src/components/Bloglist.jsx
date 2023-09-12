import Blog from './Blog';

const Bloglist = ({ blogs, addLike }) => {
  if(!blogs) return (<div></div>);

  return (
    <div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} like={() => addLike(blog.id)} />
      )}
    </div>
  );
};

export default Bloglist;