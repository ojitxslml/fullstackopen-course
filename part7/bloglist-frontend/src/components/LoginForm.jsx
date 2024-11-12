import PropTypes from "prop-types";

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
  handleCancel,
}) => {
  const inputClass =
    "border border-gray-300 rounded px-3 py-2 mt-1 flex-1 text-gray-700"; 
  const labelClass = "mb-2 text-lg font-medium text-white";

  return (
    <div className="max-w-sm mx-auto pt-10">
      <div className="mx-5">
        <h2 className="text-2xl text-center font-bold mb-10">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col mb-4">
            <label htmlFor="username" className={labelClass}>
              Username:
            </label>
            <input
              id="username"
              data-testid="username"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Username"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col mb-4 ">
            <label htmlFor="password" className={labelClass}>
              Password:
            </label>
            <input
              id="password"
              data-testid="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Password"
              className={inputClass}
            />
          </div>

          <div className="flex justify-between space-x-4">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
            >
              Login
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  handleCancel: PropTypes.func.isRequired,
};

export default LoginForm;
