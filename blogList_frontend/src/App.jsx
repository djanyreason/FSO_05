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

  const doLogin = async (credentials) => {
    if(user) return null;

    try {
      const userLogin = await loginService.login(credentials);
      blogService.setToken(userLogin.token);
      setUser(userLogin);
    } catch (exception) {
      window.alert('Wrong credentials');
    }
  };

  return (
    <div>
      {user === null
        ? <Login doLogin={doLogin} />
        : <Bloglist blogs={blogs} user={user}/>
      }
    </div>
  );
};

export default App;