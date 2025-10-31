import React from 'react'
import { useContext, createContext, useEffect, useState } from 'react'
import { GetMyProfile } from '../../Api/Auth/AuthApi'; // Adjust the import path as necessary

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = not loaded, {} = loaded but empty

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await GetMyProfile(); 
        setUser(response.data);
        console.log(response)
      } catch (error) {
        console.error('Failed to fetch current user', error);
      }
    };

    fetchMe();
  }, []);

  // useEffect(() => {
  //   console.log("Header rerendered, user:", user);
  // }, [user]);
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);