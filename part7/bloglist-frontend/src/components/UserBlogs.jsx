import { useParams } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserById } from '../contexts/usersListSlice';

const UserBlogs = () => {
  const { id } = useParams();  // Acceder al parámetro 'id' de la URL

  const dispatch = useDispatch();
  const { userById, status, error } = useSelector((state) => state.users);
  const user = userById;

  useEffect(() => {
    if (id) {
      dispatch(fetchUserById(id));
    }
  }, [dispatch, id]);

  if (status === 'loading') return <p>Loading blogs...</p>;
  if (status === 'failed') return <p>Error: {error}</p>;

  return (
    <div>
      {user ? (
        <div>
          <h2>{user.name}</h2>
          {user.blogs.length > 0 ? (
            <ul>
              {user.blogs.map((blog) => (
                <li key={blog.id}>{blog.title}</li>
              ))}
            </ul>
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
