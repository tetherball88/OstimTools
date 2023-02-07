import { createRoot } from 'react-dom/client';
import { StyledEngineProvider } from '@mui/material/styles';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Main } from './common/ui/Main';

const container = document.getElementById('app');
const root = createRoot(container as any);
root.render(
    <StyledEngineProvider injectFirst>
        <Main />
    </StyledEngineProvider>
);
