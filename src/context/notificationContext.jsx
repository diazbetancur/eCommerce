import React, { createContext, useContext, useState } from "react";

const NotificationsContext = createContext();

export const useNotifications = () => {
  return useContext(NotificationsContext);
};

export const NotificationsProvider = ({ children }) => {
  const [notificationsCount, setNotificationsCount] = useState(3); // Valor inicial

  return (
    <NotificationsContext.Provider
      value={{ notificationsCount, setNotificationsCount }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
