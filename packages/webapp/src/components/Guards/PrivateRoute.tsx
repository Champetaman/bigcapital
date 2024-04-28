// @ts-nocheck
import React from 'react';
import BodyClassName from 'react-body-classname';
import { Redirect } from 'react-router-dom';
import { useIsAuthenticated } from '@/hooks/state';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const isAuthenticated = useIsAuthenticated();

  return isAuthenticated ? (
    children
  ) : (
    <Redirect to={{ pathname: '/auth/login' }} />
  );
}
