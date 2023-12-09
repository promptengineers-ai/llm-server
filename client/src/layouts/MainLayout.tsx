import { useState, useEffect } from 'react';
import Sidebar from '../components/nav/Sidebar';
import Footer from '../components/sections/Footer';
import { useChatContext } from '../contexts/ChatContext';
import { capitalizeFirstLetter } from '../utils/format';
import Select from '../components/selects/Select';
import { useLoaderContext } from '../contexts/LoaderContext';
import { useAuthContext } from '../contexts/AuthContext';
import config from '../config';

export default function MainLayout({ children }: React.PropsWithChildren<{}>) {
	const {logout} = useAuthContext();
	const {listVectorIndexes, vectorstores, deleteVectorstore} = useLoaderContext();
    const {type, setType, chatPayload, setChatPayload} = useChatContext();
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [icon, setIcon] = useState('bi bi-robot');

	useEffect(() => {
		if (type === 'default') {
			setIcon('bi bi-chat-right-dots-fill');
		}
		if (type === 'agent') {
			setIcon('bi bi-robot');
		}
		if (type === 'vectorstore') {
			setIcon('bi bi-folder-fill');
		}
	}, [type]);

	useEffect(() => {}, [chatPayload]);

    return (
        <div className={`page-wrapper${open ? ' toggled' : ''}`}>
			<div className="page-header">

				<div className="brand">
					<a href="/" className="logo">
						<img src={config.APP_LOGO_PATH} className="d-none d-md-block me-4" alt="App Logo" />
						<img src={config.APP_LOGO_PATH} className="d-block d-md-none me-4" alt="App Logo" />
					</a>
				</div>

				<div className="toggle-sidebar" id="toggle-sidebar" onClick={()=>setOpen(!open)}>
					<i className="bi bi-list"></i>
				</div>

				<div className="header-actions-container">
					{/* <div className="search-container me-3 d-xl-block d-lg-none">
						<div className="input-group">
							<input type="text" className="form-control" placeholder="Search Jobs" />
							<button className="btn btn-outline-secondary" type="button">
								<i className="bi bi-search"></i>
							</button>
						</div>
					</div> */}

					{/* <div className="header-actions d-xl-flex d-lg-none">
						<a href="events.html" data-bs-toggle="tooltip" data-bs-placement="bottom"
							data-bs-custom-class="custom-tooltip-red" data-bs-title="Events List">
							<i className="bi bi-bell font-1xx"></i>
						</a>
						<a href="account-settings.html" data-bs-toggle="tooltip" data-bs-placement="bottom"
							data-bs-custom-class="custom-tooltip-blue" data-bs-title="Settings">
							<i className="bi bi-gear font-1xx"></i>
						</a>
					</div> */}

					<div className="header-profile d-flex align-items-center justify-content-end position-relative ms-3">
						<div className="dropdown">
							<a href="#" onClick={(e)=>e.preventDefault()} id="userSettings" className="user-settings" data-toggle="dropdown" aria-haspopup="true">
								<span className="user-name d-none d-md-block">John Smith</span>
								<span className="avatar">
									<img src="https://avatars.githubusercontent.com/u/139279732?s=200&v=4" alt="User Avatar" />
									<span className="status online"></span>
								</span>
							</a>
							<div className="dropdown-menu dropdown-menu-end" aria-labelledby="userSettings">
								<div className="header-profile-actions">
									<a href={config.APP_DOCUMENTATION_URL}>Documentation</a>
									<a href="/">Settings</a>
									<a onClick={logout}>Logout</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="main-container">
				<Sidebar />
				<div className="content-wrapper-scroll">
					<div className="main-header d-flex align-items-center justify-content-between position-relative">
						<div className="d-flex align-items-center justify-content-center">
							<div className="page-icon pe-1">
								<i className={icon}></i>
							</div>
							{/* <div className="page-title d-none d-md-block">
								<h5>Welcome back</h5>
							</div> */}
						</div>
						{type === 'agent' && (
							<h4>Tools enabled: {chatPayload.tools.length}</h4>
						)}
						{type === 'vectorstore' && (
							<Select
								handleChange={(item: any) => {
									setChatPayload({ ...chatPayload, vectorstore: item.value })
									sessionStorage.setItem('vectorstore', item.value);
								}}
								loading={loading}
								value={
									chatPayload.vectorstore
									? {label: chatPayload.vectorstore, value: chatPayload.vectorstore}
									: vectorstores[0]
								}
								deleteCallback={async (item: {label: string, value: string}) => {
									try {
										await deleteVectorstore({
											provider: chatPayload.provider,
											vectorstore: item.value
										})
										alert(`Vectorstore ${item.label} deleted successfully.`)
									} catch (error: unknown) {
										// Handle error here
										console.error(error);
										alert((error as any).response.data.detail);
									}
								}}
								options={vectorstores}
								onMenuOpen={async () => {
									if (vectorstores.length < 1) {
										setLoading(true);
									}
									await listVectorIndexes(chatPayload.provider);
									setLoading(false);
								}}
							/>
						)}
						<div className="btn-group">
							<button type="button" className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
								{capitalizeFirstLetter(type)}
							</button>
							<ul className="dropdown-menu">
								<li className="dropdown-item" onClick={()=>setType('default')}>
									Chat
								</li>
								<li className="dropdown-item" onClick={()=>setType('vectorstore')}>
									Vectorstore
								</li>
								<li className="dropdown-item" onClick={()=>setType('agent')}>
									Agent
								</li>
							</ul>
						</div>
					</div>
				</div>


				<div className="content-wrapper">
					{children}
				</div>
			</div>
			<Footer />
		</div>
    );
}