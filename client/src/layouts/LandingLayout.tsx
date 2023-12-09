import config from '../config';

export default function LandingLayout({ children }: React.PropsWithChildren<{}>) {

    return (
        <div className={'login-container'}>
			<div className="container">
				<form method="POST" action="/login">
					<div className="login-box rounded-2 p-5">
						<div className="login-form">
							<center>
								<img src={config.APP_LOGO_PATH} alt="Company Logo" />

							<h5 className="fw-light mb-5"><strong>Company Name Portal</strong></h5></center><hr />
							<div className="mb-3">
								<label className="form-label">Your Email</label>
								<input id="email" type="email" className="form-control " name="email" value="" required={true} />
							</div>
							<div className="mb-3">
								<label className="form-label">Your Password</label>
								<input id="password" type="password" className="form-control " name="password" required={true} />
							</div>
							<div className="d-flex align-items-center justify-content-between">
								<div className="form-check m-0">
									<input className="form-check-input" type="checkbox" value="" id="rememberPassword" />
									<label className="form-check-label">Remember</label>
								</div>
								<a href="forgot-password.html" className="text-blue text-decoration-underline">Lost password?</a>
							</div>
							<div className="d-grid py-3">
								<button type="submit" className="btn btn-lg btn-primary">
									Login
								</button>
							</div>
							<div className="text-center py-3">or login with</div>
							<div className="d-flex gap-2 justify-content-center">
								<button type="submit" className="btn btn-outline-light">
									<img
										src="img/google.svg"
										className="login-icon"
										alt="Login with Google"
									/>
								</button>
								<button type="submit" className="btn btn-outline-light">
									<img
										src="img/facebook.svg"
										className="login-icon"
										alt="Login with Facebook"
									/>
								</button>
							</div>
							<div className="text-center pt-3">
								<span>Not registered?</span>
								<a href="/register" className="text-blue text-decoration-underline ms-2">
									Create an account</a>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
    );
}