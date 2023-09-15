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
  const hideWhenHidden = { display: hidden ? 'none' : '' };

  return (
    <div className='aBlog' style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={toggleHidden} style={{ marginLeft: 10 }}>
        { hidden
          ? 'view'
          : 'hide'
        }
      </button>
      <div className='url' style={hideWhenHidden}>{blog.url}</div>
      <div className='likes' style={hideWhenHidden}>
        likes {blog.likes}
        <button className = 'likeButton' onClick={like}>like</button>
      </div>
      <div className='userName' style={hideWhenHidden}>{blog.user.name}</div>
      { deleteBlog === null
        ? <></>
        : <button className='deleteButton' onClick={deleteBlog} style={hideWhenHidden}>remove</button>
      }
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  like: PropTypes.func.isRequired
};

export default Blog;