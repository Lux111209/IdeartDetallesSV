// src/hooks/useFetchUser.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useUser = (userId) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`/api/users/${userId}`)
      .then(res => setUser(res.data))
      .catch(err => console.error('Error al obtener el usuario', err));
  }, [userId]);

  const updateUser = async (updatedUser) => {
    try {
      const res = await axios.put(`/api/users/${userId}`, updatedUser);
      setUser(res.data);
    } catch (err) {
      console.error('Error al actualizar el usuario', err);
    }
  };

  const deleteUser = async () => {
    try {
      await axios.delete(`/api/users/${userId}`);
      setUser(null);
    } catch (err) {
      console.error('Error al eliminar el usuario', err);
    }
  };

  return { user, setUser, updateUser, deleteUser };
};

export default useUser;
