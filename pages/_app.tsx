import { NextPage } from 'next';
import { AppProps } from 'next/app';
import Script from 'next/script';
import React, { useEffect, useState } from 'react';
import '../src/styles/globals.css';

export interface IPageProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  connectedAddress?: string;
  connectWallet: () => Promise<void>;
  disconnect: () => Promise<void>;
}

interface IRootProps extends AppProps {
  Component: NextPage<any, IPageProps>;
}

export default function App(props: IRootProps) {
  const { Component } = props;

  const [darkMode, setDarkMode] = useState<boolean>();

  useEffect(() => {
    if (darkMode !== undefined) {
      if (darkMode) {
        // Set value of  darkmode to dark
        document.documentElement.setAttribute('data-theme', 'dark');
        window.localStorage.setItem('theme', 'dark');
      } else {
        // Set value of  darkmode to light
        document.documentElement.setAttribute('data-theme', 'light');
        window.localStorage.setItem('theme', 'light');
      }
    }
  }, [darkMode]);

  useEffect(() => {
    const root = window.document.documentElement;
    const initialColorValue = root.style.getPropertyValue(
      '--initial-color-mode'
    );
    // Set initial darkmode to light
    setDarkMode(initialColorValue === 'dark');
  }, []);

  return (
    <>
      <Script
        strategy="lazyOnload"
        id="gtag"
      >{`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments)} gtag('js', new Date()); gtag('config', '${process.env.GA_TAG}');`}</Script>

      <Component darkMode={darkMode} setDarkMode={setDarkMode} />
    </>
  );
}
