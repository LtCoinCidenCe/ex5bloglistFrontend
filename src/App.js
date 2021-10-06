import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () =>
{
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState('');
  const [mTime, setmTime] = useState(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() =>
  {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, []);

  useEffect(() =>
  {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if (loggedUserJSON)
    {
      const u = JSON.parse(loggedUserJSON);
      setUser(u);
      blogService.setToken(u.token);
    }
  }, []);

  const handleLogout = () =>
  {
    setUser(null);
    blogService.setToken(null);
    window.localStorage.removeItem('loggedUser');
  }

  const handleLogin = async (event) =>
  {
    event.preventDefault();

    try
    {
      console.log('logging in with: ', username, password);
      const kirjaudu = await loginService.login({ username, password });
      setUser(kirjaudu);
      blogService.setToken(kirjaudu.token);
      setUsername('');
      setPassword('');
      // preserve token
      window.localStorage.setItem('loggedUser', JSON.stringify(kirjaudu));
    }
    catch (exception)
    {
      setMessage(`e:${exception.response.data.error}`);
      clearTimeout(mTime);
      setmTime(setTimeout(() => { setMessage(''); }, 5000));
    }
  }

  const handleCreate = async (event) =>
  {
    event.preventDefault();
    const newBlog = { title, author, url };
    try
    {
      const response = await blogService.create(newBlog);
      setBlogs(blogs.concat(response));
      setTitle('');
      setAuthor('');
      setUrl('');
      setMessage(`s:a new blog "${response.title}" is added`);
      clearTimeout(mTime);
      setmTime(setTimeout(() => { setMessage(''); }, 5000));
    }
    catch (exception)
    {
      console.log('exception',exception.response);
      setMessage(`e:${exception.response.data.error}`);
      clearTimeout(mTime);
      setmTime(setTimeout(() => { setMessage(''); }, 5000));
    }
  }

  if (user === null)
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message} />
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
        <Notification message={message} />
        <p><span>{user.name} logged in</span><button onClick={handleLogout}>logout</button></p>
        <h3>create new blog</h3>
        <form onSubmit={handleCreate}>
          <div>title: <input type="text" name="title" value={title} onChange={event => setTitle(event.target.value)} /></div>
          <div>author: <input type="text" name="author" value={author} onChange={event => setAuthor(event.target.value)} /></div>
          <div>url: <input type="text" name="url" value={url} onChange={event => setUrl(event.target.value)} /></div>
          <div><input type="submit" value="create" /></div>
        </form>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    )
}

export default App;
