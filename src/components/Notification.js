import './Notification.css'

const Notification = ({ message }) =>
{
  if (message !== null)
  {
    if (message.startsWith('e:')) // error
      return <div className='error info'>{message.slice(2)}</div>
    if (message.startsWith('s:')) // success
      return <div className='success info'>{message.slice(2)}</div>
  }
  return null;
}

export default Notification;
