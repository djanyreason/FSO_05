import { useState, useEffect } from 'react';
import blogService from './services/blogs';
import loginService from './services/login';
import Bloglist from './components/Bloglist';
import Login from './components/Login';

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

  return (
    <div>
      {user === null
        ? <Login doLogin={doLogin} />
        : <Bloglist blogs={blogs} user={user} doLogout={doLogout}/>
      }
    </div>
  );
};

export default App;