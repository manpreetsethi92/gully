import { useEffect, useRef } from 'react';

/**
 * Custom hook that creates an AbortController and cleans it up on unmount
 * Prevents memory leaks from async operations
 *
 * Usage:
 * const signal = useAbortController();
 *
 * useEffect(() => {
 *   fetch('/api/data', { signal })
 *     .then(res => res.json())
 *     .then(data => setData(data))
 *     .catch(err => {
 *       if (err.name !== 'AbortError') {
 *         console.error(err);
 *       }
 *     });
 * }, [signal]);
 */
export function useAbortController() {
  const abortControllerRef = useRef(null);

  useEffect(() => {
    // Create a new AbortController for this render
    abortControllerRef.current = new AbortController();

    // Cleanup: abort all pending requests when component unmounts
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return abortControllerRef.current?.signal;
}

/**
 * Custom hook for axios that returns an axios instance with automatic request cancellation
 * on component unmount
 *
 * Usage:
 * const axiosInstance = useAxios();
 *
 * useEffect(() => {
 *   axiosInstance.get('/api/data')
 *     .then(res => setData(res.data))
 *     .catch(err => {
 *       if (err.code !== 'ERR_CANCELED') {
 *         console.error(err);
 *       }
 *     });
 * }, [axiosInstance]);
 */
export function useAxios(axiosInstance) {
  const cancelTokenSourceRef = useRef(null);

  useEffect(() => {
    // Create cancel token source
    const axios = require('axios');
    cancelTokenSourceRef.current = axios.CancelToken.source();

    // Cleanup: cancel all pending requests when component unmounts
    return () => {
      if (cancelTokenSourceRef.current) {
        cancelTokenSourceRef.current.cancel('Component unmounted');
      }
    };
  }, []);

  // Return axios instance with cancel token pre-configured
  const axios = require('axios');
  return {
    ...axiosInstance || axios,
    get: (url, config = {}) => {
      return (axiosInstance || axios).get(url, {
        ...config,
        cancelToken: cancelTokenSourceRef.current?.token
      });
    },
    post: (url, data, config = {}) => {
      return (axiosInstance || axios).post(url, data, {
        ...config,
        cancelToken: cancelTokenSourceRef.current?.token
      });
    },
    put: (url, data, config = {}) => {
      return (axiosInstance || axios).put(url, data, {
        ...config,
        cancelToken: cancelTokenSourceRef.current?.token
      });
    },
    delete: (url, config = {}) => {
      return (axiosInstance || axios).delete(url, {
        ...config,
        cancelToken: cancelTokenSourceRef.current?.token
      });
    }
  };
}
