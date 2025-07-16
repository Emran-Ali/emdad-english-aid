'use client';
import React, {createContext, useContext, useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import {apiGet, apiPost} from '../axios/index';

const JWTAuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
});

const JWTAuthActionsContext = createContext({
  signInUser: async () => Promise.resolve({success: false}),
  logout: async () => Promise.resolve(),
});

export const useJWTAuth = () => useContext(JWTAuthContext);
export const useJWTAuthActions = () => useContext(JWTAuthActionsContext);

const JWTAuthAuthProvider = ({children}) => {
  const [jWTAuthData, setJWTAuthData] = useState({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const getAuthUser = async () => {
      const token = Cookies.get('authToken');
      if (!token) {
        setJWTAuthData({
          user: undefined,
          isLoading: false,
          isAuthenticated: false,
        });
        return;
      }
      try {
        const {data} = await apiGet('api/signin');

        setJWTAuthData({
          user: data.data,
          isLoading: false,
          isAuthenticated: true,
        });
      } catch (err) {
        setJWTAuthData({
          user: undefined,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    getAuthUser();
  }, []);

  const signInUser = async ({phone, password}) => {
    try {
      const {data} = await apiPost('api/signin', {phone, password});
      Cookies.set('authToken', JSON.stringify(data.data.authToken));
      Cookies.set('refreshToken', JSON.stringify(data.data.refreshToken));

      setJWTAuthData({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return {success: true};
    } catch (error) {
      const errorResponse = error.response?.data?.errors || {
        phone: 'Phone number error',
        password: 'Password error',
      };
      return {
        success: false,
        errors: errorResponse,
        message: error.response?.data?.message,
      };
    }
  };

  const logout = async () => {
    Cookies.remove('authToken');
    Cookies.remove('refreshToken');
    setJWTAuthData({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  return (
    <JWTAuthContext.Provider
      value={{
        ...jWTAuthData,
      }}>
      <JWTAuthActionsContext.Provider
        value={{
          signInUser,
          logout,
        }}>
        {children}
      </JWTAuthActionsContext.Provider>
    </JWTAuthContext.Provider>
  );
};

export default JWTAuthAuthProvider;
