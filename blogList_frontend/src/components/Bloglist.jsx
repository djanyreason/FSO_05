import Blog from './Blog';
import PropTypes from 'prop-types';

const Bloglist = ({ blogs, addLike, username, remove }) => {
  if(!blogs) return (<div></div>);

  return (
    <div className='blogList'>
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

Bloglist.propTypes = {
  blogs: PropTypes.array.isRequired,
  addLike: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  remove: PropTypes.func.isRequired
};

export default Bloglist;