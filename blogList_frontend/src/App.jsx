import { useState, useEffect, useRef } from 'react';
import blogService from './services/blogs';
import loginService from './services/login';
import Bloglist from './components/Bloglist';
import Login from './components/Login';
import Newblog from './components/Newblog';
import Notification from './components/Notification';
import Togglable from './components/Togglable';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageTimeouts, setMessageTimeouts] = useState(0);
  const messTimRef = useRef(messageTimeouts);
  messTimRef.current = messageTimeouts;

  const newBlogVisible = useRef();

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    );
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser');
    if(loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON);
      setUser(loggedUser);
      blogService.setToken(loggedUser.token);
    }
  }, []);

  const handleMessage = (newMessage) => {
    setMessage(newMessage);
    setMessageTimeouts(messTimRef.current+1);
    setTimeout(() => {
      if(messTimRef.current === 1) setMessage(null);
      setMessageTimeouts(messTimRef.current-1);
    }, 5000);
  };

  const doLogin = async (credentials) => {
    if(user) return null;

    try {
      const userLogin = await loginService.login(credentials);
      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(userLogin));
      blogService.setToken(userLogin.token);
      setUser(userLogin);
      handleMessage({
        color: 'green',
        content: `${userLogin.name} (b)logged in`
      });
    } catch (exception) {
      handleMessage({
        color: 'red',
        content: 'wrong username or password'
      });
    }
  };

  const doLogout = () => {
    handleMessage({
      color: 'green',
      content: `${user.name} logged out`
    });
    window.localStorage.removeItem('loggedBloglistUser');
    blogService.setToken(null);
    setUser(null);
  };

  const addBlog = async (newBlog) => {
    try {
      const addedBlog = await blogService.addBlog(newBlog);
      const id = addedBlog.user;
      addedBlog.user = {
        id: id,
        username: user.username,
        name: user.name
      };
      setBlogs(blogs.concat(addedBlog));
      handleMessage({
        color: 'green',
        content: `a new blog ${addedBlog.title} by ${addedBlog.author} added`
      });
      newBlogVisible.current.toggleVisibility();
      return true;
    } catch (exception) {
      handleMessage({
        color: 'red',
        content: `blog addition failed due to error: ${exception.response.data.error}`
      });
      return false;
    }
  };

  const addLike = async (id) => {
    const blog = blogs.find(b => b.id === id);
    const likedBlog = { ...blog, likes: blog.likes+1 };

    try {
      await blogService.updateBlog(likedBlog);
      setBlogs(blogs.map(b => b.id !== id ? b : likedBlog));
      handleMessage({
        color: 'green',
        content: `Like added to blog ${likedBlog.title}`
      });
    } catch (exception) {
      handleMessage({
        color: 'red',
        content: `blog update failed due to error: ${exception.response.data.error}`
      });
      return false;
    }
  };

  const removeBlog = async(id) => {
    const blog = blogs.find(b => b.id === id);

    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.deleteBlog(id);
        setBlogs(blogs.filter(b => b.id !== id));
        handleMessage({
          color: 'green',
          content: `Blog ${blog.title} by ${blog.author} removed`
        });
      } catch (exception) {
        handleMessage({
          color: 'red',
          content: `blog update failed due to error: ${exception.response.data.error}`
        });
        return false;
      }
    }
  };

  return (
    <div>
      <h2>{user === null
        ? '(b)log in to application'
        : 'blogs'}
      </h2>
      <Notification message={message}/>
      {user === null
        ? <div>
          <Login doLogin={doLogin} />
        </div>
        : <div>
          <p>{user.name} logged in<button onClick={doLogout}>logout</button></p>
          <Togglable buttonLabel='new blog' ref={newBlogVisible}>
            <Newblog addBlog={addBlog} />
          </Togglable>
          <Bloglist blogs={blogs} addLike={addLike} username={user.username} remove={removeBlog} />
        </div>
      }
    </div>
  );
};

export default App;