const Notification = ({ message, type }) => {
  if (!message) return null;

  return (
    <div className={`notification ${type === "error" ? "bg-red-600" : "bg-green-600"}`}>
      {message}
    </div>
  );
};

export default Notification;
