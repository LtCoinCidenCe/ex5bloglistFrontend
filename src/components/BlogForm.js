import React, { useState } from "react";
import PropTypes from 'prop-types';

const BlogForm = ({ createBlog }) =>
{
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handler = (event) =>
  {
    event.preventDefault();
    createBlog({ title, author, url });
    setTitle('');
    setAuthor('');
    setUrl('');
  }

  return (
    <div>
      <h3>create new blog</h3>
      <form onSubmit={handler}>
        <div>title: <input type="text" name="title" value={title} onChange={event => setTitle(event.target.value)} /></div>
        <div>author: <input type="text" name="author" value={author} onChange={event => setAuthor(event.target.value)} /></div>
        <div>url: <input type="text" name="url" value={url} onChange={event => setUrl(event.target.value)} /></div>
        <div><input type="submit" value="create" /></div>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm;
