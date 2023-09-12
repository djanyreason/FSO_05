import { useState } from 'react';

const Blog = ({ blog }) => {
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
            <button onClick={() => null}>like</button>
          </div>
          <div>{blog.user.name}</div>
        </div>
      }
    </div>
  );
};

export default Blog;