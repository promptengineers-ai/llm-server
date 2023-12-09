import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatProvider from './contexts/ChatContext';
import LoaderProvider from './contexts/LoaderContext';
import AuthProvider from './contexts/AuthContext';
import AppProvider from './contexts/AppContext';

// Import your page components
import Login from './pages/login';
import Chat from './pages/chat';
import ProtectedRoute from './components/auth/protected';
// import NotFoundPage from './components/NotFoundPage';

function App() {
	return (
		<Router>
			<AppProvider>
				<AuthProvider>
					<LoaderProvider>
						<ChatProvider>
							<Routes>
								<Route
									path="/"
									element={
										<ProtectedRoute>
											<Chat />
										</ProtectedRoute>
									}
								/>
								<Route path="/login" element={<Login />} />
							</Routes>
						</ ChatProvider>
					</LoaderProvider>
				</AuthProvider>
			</AppProvider>
		</Router>
	);
}

export default App;
