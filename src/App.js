import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () =>
{
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() =>
  {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, []);

  const handleLogin = async (event) =>
  {
    event.preventDefault();

    try
    {
      console.log('logging in with: ', username, password);
      const kirjaudu = await loginService.login({ username, password });
      setUser(kirjaudu);
      setUsername('');
      setPassword('');
    }
    catch (exception)
    {
      alert('wrong credentials');
    }
  }

  if (user === null)
    return (
      <div>
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>username
            <input type="text"
              value={username}
              name="Username"
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>
          <div>password
            <input type="text"
              value={password}
              name="Password"
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  else
    return (
      <div>
        <h2>blogs</h2>
        <p>{user.name} logged in</p>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    )
}

export default App;
