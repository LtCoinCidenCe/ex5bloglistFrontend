import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
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

  const blogCreator = useRef();

  useEffect(() =>
  {
    // 5.9 add sort
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
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

  const createBlog = async (blog) =>
  {
    try
    {
      const response = await blogService.create(blog);
      setBlogs(blogs.concat(response).sort((a, b) => b.likes - a.likes)); // 5.9 add sort
      blogCreator.current.toggleVisibility();
      setMessage(`s:a new blog "${response.title}" is added`);
      clearTimeout(mTime);
      setmTime(setTimeout(() => { setMessage(''); }, 5000));
    }
    catch (exception)
    {
      console.log('exception', exception.response);
      setMessage(`e:${exception.response.data.error}`);
      clearTimeout(mTime);
      setmTime(setTimeout(() => { setMessage(''); }, 5000));
    }
  }

  const plusLike = async (id) =>
  {
    const oldBlog = blogs.find(blog => blog.id === id);
    let newblog = { ...oldBlog };
    delete newblog.id;
    newblog.user = oldBlog.user.id;
    newblog.likes += 1;

    try
    {
      const data = await blogService.update(oldBlog.id, newblog);
      setBlogs(blogs.map(blog => blog.id !== oldBlog.id ? blog : data)
        .sort((a, b) => b.likes - a.likes)); // 5.9 add sort
      // something wrong would happen if there is no such blog with that id because of backend is not handling
      // there was no that exercise in part 4 around update with credential and exception
      // but still any blog needs to be deleted from other client before it causes an error
    }
    catch (exception)
    {
      console.log(exception);
      setMessage(`e:${exception.response}`);
      clearTimeout(mTime);
      setmTime(setTimeout(() => { setMessage(''); }, 5000));
    }
  }

  const blogForm = () => (
    <Togglable buttonLabel="create new blog" ref={blogCreator}>
      <BlogForm createBlog={createBlog} />
    </Togglable>
  )

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

        {blogForm()}
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} handleLike={() => plusLike(blog.id)} />
        )}
      </div>
    )
}

export default App;
