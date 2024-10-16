const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  return (
    type === 'error' ?
      <div className="error">
        {message}
      </div>
      :
      <div className="successful">
        {message}
      </div>
  )
}

export default Notification