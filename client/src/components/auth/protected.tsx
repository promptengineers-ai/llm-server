import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext'; // adjust the import path as needed

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { isAuthenticated } = useAuthContext();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return children;
};
