import React, { createContext, useContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [busquedaGlobal, setBusquedaGlobal] = useState('');

  const value = useMemo(() => ({ busquedaGlobal, setBusquedaGlobal }), [busquedaGlobal]);

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

SearchProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch debe usarse dentro de SearchProvider');
  }
  return context;
};
