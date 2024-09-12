// TabContext.js
import React, { createContext, useState, useContext } from 'react';

// Create the context
const TabContext = createContext();

// Custom hook to access the tab context
export const useTabContext = () => useContext(TabContext);

// TabProvider to wrap the component tree
export const TabProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('rpa'); // Default tab is 'tab1'

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
};
