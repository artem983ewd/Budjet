import '@mantine/core/styles.css';
import '../index.css';

import { MantineProvider, useMantineColorScheme } from '@mantine/core';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router } from './router/Router';
import { theme } from '../theme';

const queryClient = new QueryClient();

function ColorSchemeManager({ children }: { children: React.ReactNode }) {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  useEffect(() => {
    document.documentElement.setAttribute('data-mantine-color-scheme', colorScheme);
  }, [colorScheme]);

  return <>{children}</>;
}

export function App() {
  return (
    <MantineProvider theme={theme}>
      <ColorSchemeManager>
        <QueryClientProvider client={queryClient}>
          <Router />
        </QueryClientProvider>
      </ColorSchemeManager>
    </MantineProvider>
  );
}
