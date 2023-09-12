import { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog, like, deleteBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    borderStyle: 'solid',
    borderWidth: 1,
    marginBottom: 5
  };

  const [hidden, setHidden] = useState('true');
  const toggleHidden = () => setHidden(!hidden);

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={toggleHidden} style={{ marginLeft: 10 }}>
        { hidden
          ? 'view'
          : 'hide'
        }
      </button>
      { hidden
        ? <></>
        : <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}
            <button onClick={like}>like</button>
          </div>
          <div>{blog.user.name}</div>
          { deleteBlog === null
            ? <></>
            : <button onClick={deleteBlog}>remove</button>
          }
        </div>
      }
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  like: PropTypes.func.isRequired
};

export default Blog;