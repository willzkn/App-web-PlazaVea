import { useState, useEffect } from 'react';

// Hook genérico para manejar llamadas a la API
export const useApi = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
};

// Hook para operaciones CRUD
export const useCrud = (service) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (operation, ...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await service[operation](...args);
      return result;
    } catch (err) {
      setError(err.message || 'Error en la operación');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    create: (data) => execute('create', data),
    update: (id, data) => execute('update', id, data),
    delete: (id) => execute('delete', id),
  };
};
