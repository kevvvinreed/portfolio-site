import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <body>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  function getInitialColorMode() {
                    const persistedPreferenceMode = window.localStorage.getItem('theme');
                    const hasPersistedPreference = typeof persistedPreferenceMode === 'string';

                    if (hasPersistedPreference) {
                      return persistedPreferenceMode;
                    }

                    const preference = window.matchMedia('(prefers-color-scheme: dark)');
                    const hasMediaQueryPreference = typeof preference.matches === 'boolean';

                    if (hasMediaQueryPreference) {
                      return preference.matches ? 'dark' : 'light';
                    }

                    return 'light';
                  }

                  const currentColorMode = getInitialColorMode();
                  const element = document.documentElement;
                  element.style.setProperty('--initial-color-mode', currentColorMode);

                  if (currentColorMode === 'dark') {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                })();
              `,
            }}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
