import { useState } from 'react';
import PropTypes from 'prop-types';

const Newblog = ({ addBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setURL] = useState('');

  const handleAdd = async (event) => {
    event.preventDefault();

    const result = await addBlog({
      title: title,
      author: author,
      url: url
    });

    if(result) {
      setTitle('');
      setAuthor('');
      setURL('');
    }
  };

  return (
    <form onSubmit={handleAdd}>
      <div>
        title:
        <input
          type='text'
          value={title}
          name='Title'
          onChange={({ target }) => setTitle(target.value)}
          id='blogTitle'
        />
      </div>
      <div>
        author:
        <input
          type='text'
          value={author}
          name='Author'
          onChange={({ target }) => setAuthor(target.value)}
          id='author'
        />
      </div>
      <div>
        url:
        <input
          type='text'
          value={url}
          name='URL'
          onChange={({ target }) => setURL(target.value)}
          id='url'
        />
      </div>
      <button id='blogAddButton' type='submit'>create</button>
    </form>
  );
};

Newblog.proptypes = {
  addBlog: PropTypes.func.isRequired
};

export default Newblog;