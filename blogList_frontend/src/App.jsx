import { useState, useEffect } from 'react';
import blogService from './services/blogs';
import loginService from './services/login';
import Bloglist from './components/Bloglist';
import Login from './components/Login';
import Newblog from './components/Newblog';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);

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

  const doLogin = async (credentials) => {
    if(user) return null;

    try {
      const userLogin = await loginService.login(credentials);
      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(userLogin));
      blogService.setToken(userLogin.token);
      setUser(userLogin);
    } catch (exception) {
      window.alert('Wrong credentials');
    }
  };

  const doLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser');
    blogService.setToken(null);
    setUser(null);
  };

  const addBlog = async (newBlog) => {
    try {
      const addedBlog = await blogService.addBlog(newBlog);
      setBlogs(blogs.concat(addedBlog));
      return true;
    } catch (exception) {
      window.alert(exception.response.data.error);
      return false;
    }
  };

  return (
    <div>
      {user === null
        ? <Login doLogin={doLogin} />
        : <div>
          <h2>blogs</h2>
          <p>{user.name} logged in<button onClick={doLogout}>logout</button></p>
          <Newblog addBlog={addBlog} />
          <Bloglist blogs={blogs} />
        </div>
      }
    </div>
  );
};

export default App;