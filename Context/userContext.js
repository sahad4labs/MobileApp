import React, { createContext, useContext, useEffect, useState } from "react";
import EncryptedStorage from "react-native-encrypted-storage";
import api from "../services/api";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [path,setPath]=useState(null);

  const [activeProfileId, setActiveProfileId] = useState(null);
  const [activeTicketId, setActiveTicketId] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await api.get("/me"); 
      console.log(res.data);
      
      setUser(res.data);
    } catch (err) {
      console.log("Fetch user error", err.response?.data || err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    await EncryptedStorage.removeItem("authToken");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser, logout, loading,activeProfileId,
        setActiveProfileId,
        activeTicketId,
        setActiveTicketId, 
        path,
        setPath}}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
