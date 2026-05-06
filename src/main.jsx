import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from './hooks/user/useAuth';

const queryClient = new QueryClient();

// 앱 시작 시 세션 복원
function AppWithRestore() {
    const { restoreSession } = useAuth();

    useEffect(() => {
        restoreSession();
    }, []);

    return <App />;
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AppWithRestore />
            </BrowserRouter>
        </QueryClientProvider>
    </StrictMode>
);