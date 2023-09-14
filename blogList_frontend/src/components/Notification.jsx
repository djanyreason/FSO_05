const Notification = ({ message }) => {
  if (message === null) return null;

  const notificationStyle = {
    color: message.color,
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  };

  return (
    <div className='notification' style={notificationStyle}>
      {message.content}
    </div>
  );
};

export default Notification;