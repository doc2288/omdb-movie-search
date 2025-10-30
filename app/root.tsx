import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  LiveReload,
} from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';
import stylesheet from '~/styles/tailwind.css';
import { ThemeProvider } from '~/contexts/ThemeContext';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap' },
];

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* PRE-INIT THEME: prevent flash on navigation */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var docEl = document.documentElement;
                  docEl.setAttribute('data-initializing-theme', '1');
                  var savedTheme = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme = savedTheme || (prefersDark ? 'dark' : 'light');
                  docEl.classList.toggle('dark', theme === 'dark');
                  // remove init flag ASAP
                  docEl.removeAttribute('data-initializing-theme');
                } catch (e) {}
              })();
            `,
          }}
        />
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-light-bg-primary text-gray-900 dark:bg-dark-bg-primary dark:text-dark-text-primary transition-colors no-theme-transitions">
        <ThemeProvider>
          <Outlet />
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        {/* Remove transition-disabling class after paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  requestAnimationFrame(function(){
                    document.body.classList.remove('no-theme-transitions');
                  });
                } catch(e){}
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
