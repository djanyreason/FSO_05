import Blog from './Blog';

const Bloglist = ({ blogs }) => {
  if(!blogs) return (<div></div>);

  return (
    <div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  );
};

export default Bloglist;