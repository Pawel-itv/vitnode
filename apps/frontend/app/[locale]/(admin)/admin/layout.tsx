import React from 'react';
import './global.css';

interface Props {
  children: React.ReactNode;
}

export default async function Layout({ children }: Props) {
  return children;
}
