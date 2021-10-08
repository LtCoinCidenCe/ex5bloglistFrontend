import React, { useState } from 'react';

const Blog = ({ blog, handleLike }) =>
{
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const [showDetail, setShowDetail] = useState(false);

  if (showDetail === false)
    return (
      <div style={blogStyle}>
        {blog.title} {blog.author} <button onClick={() => setShowDetail(!showDetail)}>view</button>
      </div>
    )
  else
    return (
      <div style={blogStyle}>
        <div>{blog.title}<button onClick={() => setShowDetail(!showDetail)}>hide</button></div>
        <div>{blog.url}</div>
        <div>likes {blog.likes}<button onClick={handleLike}>like</button></div>
        <div>{blog.author}</div>
      </div>
    )
}

export default Blog;
