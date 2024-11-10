import React, { useEffect } from "react";
import { fetchUsers } from "../contexts/usersListSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Users = () => {
  const dispatch = useDispatch();
  const { allUsers, status, error } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <table>
        <tbody>
          <tr className="table">
            <td>User</td>
            <td>Blogs Created</td>
          </tr>
          {allUsers.map((user) => (
            <tr key={user.id}>
              <td><Link to={`/users/${user.id}`}>{user.name}</Link></td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
