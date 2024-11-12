import { useParams } from "react-router-dom";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserById } from "../contexts/usersListSlice";

const UserBlogs = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const { userById, status, error } = useSelector((state) => state.users);
  const user = userById;

  useEffect(() => {
    if (id) {
      dispatch(fetchUserById(id));
    }
  }, [dispatch, id]);

  if (status === "loading") return <p>Loading blogs...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  return (
    <div className="bg-slate-900 rounded-md lg:mx-80 mx-5 my-6 p-4 text-white">
      {user ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">{user.name}</h2>
          {user.blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {user.blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="p-4 border border-slate-700 rounded-md bg-slate-800"
                >
                  <p className="font-semibold">{blog.title}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No blogs available</p>
          )}
        </div>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
};

export default UserBlogs;
