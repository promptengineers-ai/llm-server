// Desc: Login page for the portal
import { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import config from '../config';

export default function Login() {
	const { login } = useAuthContext();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            await login({ username, password });
        } catch (error) {
            console.error('Login failed:', error);
            // Handle the error appropriately
        }
    };

	return (
        <div className={'login-container'} style={{ height: '100vh' }}>
			<div className="container">
				<form onSubmit={handleSubmit}>
					<div className="login-box rounded-2 p-5">
						<div className="login-form">
							<center>
								<img src={config.APP_LOGO_PATH} alt="Company Logo" />
							</center>
							<hr />
							<div className="mb-3">
								<label className="form-label">Username</label>
								<input
									id="username"
									type="text"
									className="form-control"
									name="username"
									placeholder='Enter your username'
									required={true}
									value={username}
									onChange={(e) => setUsername(e.target.value)}
								/>
							</div>
							<div className="mb-3">
								<label className="form-label">Password</label>
								<input
									id="password"
									type="password"
									className="form-control"
									name="password"
									placeholder='Enter your password'
									required={true}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>
							{/* <div className="d-flex align-items-center justify-content-between">
								<div className="form-check m-0">
									<input className="form-check-input" type="checkbox" value="" id="rememberPassword" />
									<label className="form-check-label">Remember</label>
								</div>
								<a href="forgot-password.html" className="text-blue text-decoration-underline">Lost password?</a>
							</div> */}
							<div className="d-grid py-3">
								<button type="submit" className="btn btn-lg btn-primary">
									Login
								</button>
							</div>
							{/* <div className="text-center pt-3">
								<span>Not registered?</span>
								<a href="/register" className="text-blue text-decoration-underline ms-2">
									Create an account
								</a>
							</div> */}
						</div>
					</div>
				</form>
			</div>
		</div>
    );
}