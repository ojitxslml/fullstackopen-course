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

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-slate-900 rounded-md lg:mx-80 mx-5 my-6 p-4">
      <div className="grid grid-cols-2 gap-4 font-bold text-white mb-2">
        <div>User</div>
        <div>Blogs Created</div>
      </div>
      <div className="grid gap-y-2 text-white">
        {allUsers.map((user) => (
          <div key={user.id} className="grid grid-cols-2 gap-4 p-2 border-b border-slate-700">
            <div>
              <Link to={`/users/${user.id}`} className="text-blue-400 hover:underline">
                {user.name}
              </Link>
            </div>
            <div>{user.blogs.length}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
