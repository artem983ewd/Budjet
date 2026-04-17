import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';
import { Router } from './router/Router';
import { theme } from '../theme';

export function App() {
  return (
    <MantineProvider theme={theme}>
      <Router />
    </MantineProvider>
  );
}