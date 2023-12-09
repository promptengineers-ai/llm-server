import { useEffect, useState, useRef } from "react";
import { useChatContext } from "../../../contexts/ChatContext";
import { capitalizeFirstLetter, truncate } from "../../../utils/format";
import { constructAssistantMessageDiv, constructUserMessageDiv } from "../../../utils/chat";
import marked from "../../../config/marked";
import Select from "../../selects/Select";
import { MODEL_OPTIONS, VECTOR_DB_OPTIONS } from "../../../config/options";
import { useLoaderContext } from "../../../contexts/LoaderContext";
import { API_URL } from "../../../config";
import { useAuthContext } from "../../../contexts/AuthContext";
import IndexModal from "../../modals/IndexModal";
import { filterByValue } from "../../../utils/filter";
import ToolModal from "../../modals/ToolModal";


export default function Sidebar() {
    const {
        updateHistories,
        type,
        histories,
        chatPayload,
        chatboxRef,
        setChatPayload,
        setTools,
        setMessages,
        resetChat
    } = useChatContext();

    const [activeTab, setActiveTab] = useState('history'); // default active tab

    const handleTabChange = (tabName: string) => {
        setActiveTab(tabName);
    };

    const isActive = (tabName: string) => {
        return activeTab === tabName ? 'active-tab' : '';
    };

    function historySelection(item: any) {
        console.log('Conversation selected: ', item);
        const payload = {
            ...chatPayload,
            _id: item._id,
            model: item.model,
            temperature: item.temperature,
            tools: item.tools,
            systemMessage: item.messages[0].content,
            vectorstore: item.vectorstore,
        }
        // setType(chatSelectionPerChatPayload(payload));
        setChatPayload(payload);
        sessionStorage.setItem('systemMessage', item.messages[0].content);
        sessionStorage.setItem('model', item.model);
        sessionStorage.setItem('temperature', JSON.stringify(item.temperature));
        sessionStorage.setItem('vectorstore', item.vectorstore);
        setMessages(item.messages);
        // chatboxRef.current.innerHTML = '';
        setTimeout(() => {
            while (chatboxRef.current?.firstChild) {
                chatboxRef.current.removeChild(chatboxRef.current.firstChild);
            }
            for (let i = 0; i < item.messages.length; i++) {
                if (item.messages[i].role === 'user') {
                    let userMessageDiv = constructUserMessageDiv([item.messages[i]]);
                    chatboxRef.current?.appendChild(userMessageDiv);
                }
                if (item.messages[i].role === 'assistant') {
                    let assistantMessageDiv = constructAssistantMessageDiv();
                    assistantMessageDiv.innerHTML = marked.parse(item.messages[i].content);
                    chatboxRef.current?.appendChild(assistantMessageDiv);
                }
            }
        }, 200);
    }

    useEffect(() => {
		(async () => {
			await updateHistories();
		})();
	}, [])

    return (
        <nav className="sidebar-wrapper">
            <div className="container">
                <div className="row">
                    <div className="col px-4 mt-3">
                        <button
                            type="button"
                            className="btn btn-outline-light"
                            style={{ width: '100%', color: "#BEC9D9" }}
                            onClick={resetChat}
                        >
                            <i className="bi bi-plus-lg"></i>New Chat
                        </button>
                    </div>
                </div>
            </div>
            <div className="sidebar-custom-nav">
                <a href="#" className={isActive('history')} onClick={(e) => {
					e.preventDefault();
					handleTabChange('history');
				}}>
                    <i className="bi bi-clock-history"></i>
                    <span>History</span>
                </a>
                <a href="#" className={isActive('settings')} onClick={(e) => {
					e.preventDefault();
					handleTabChange('settings')
				}}>
                    <i className="bi bi-gear"></i>
                    <span>Settings</span>
                </a>
                <ToolModal />
                <IndexModal builder={true} />
            </div>
            {renderTabContent({activeTab, histories, historySelection, chatPayload, setChatPayload, type})}
        </nav>
    )
}

const renderTabContent = ({activeTab, histories, historySelection, chatPayload, setChatPayload, type}: any) => {
    switch (activeTab) {
        case 'history':
            return <HistoryMenu histories={histories} historySelection={historySelection} chatPayload={chatPayload} />;
        case 'tools':
            return <div>Tools Content</div>;
        case 'files':
            return <FilesMenu />;
        case 'settings':
            return <SettingsMenu chatPayload={chatPayload} setChatPayload={setChatPayload} type={type} />;
        default:
            return <div>Default Content</div>;
    }
};

const HistoryMenu = ({ histories, historySelection, chatPayload }: any) => {
    const { handleRemove } = useChatContext();
    const [remove, setRemove] = useState({
		id: '',
		submit: false,
	});

    useEffect(() => {
		if(remove.submit) {
			handleRemove(remove.id)
		}
	}, [remove.submit])
    return (
		<div className="sidebar-menu" style={{ height: 'calc(100% - 115px)', overflowY: 'auto' }}>
            <div className="sidebarMenuScroll os-host os-theme-dark os-host-overflow os-host-overflow-y os-host-resize-disabled os-host-scrollbar-horizontal-hidden os-host-transition">
                <div className="os-resize-observer-host observed">
                    <div className="os-resize-observer" style={{ left: '0px', right: 'auto' }}></div>
                </div>
                <div className="os-padding">
                    <div className="os-viewport os-viewport-native-scrollbars-invisible" style={{ overflowY: 'scroll' }}>
                        <div className="os-content" style={{ padding: '0px', height: '100%', width: '100%' }}>
                            <ul>
                                {histories.map((item: any, index: number) => (
                                    <li
                                        className={item._id === chatPayload._id ? 'active-page-link' : ''}
                                        key={index}
                                        style={{ display: 'flex', alignItems: 'center', position: 'relative', margin: 0}}
                                        onClick={() => historySelection(item)}
                                    >
                                        <a href="#" onClick={(event) => event.preventDefault()} style={{ padding: '5px', width: "100%" }}>
                                            <span style={{ fontSize: '10px', position: 'absolute', top: 2, right: 15 }}>
                                                Query Count: {(item.messages.length -1) / 2}
                                            </span>
                                            <i className="bi bi-chat-right" style={{ marginRight: '5px', fontSize: '20px' }}></i>
                                            <div style={{ flex: 1 }}>
                                                <span className="menu-text" style={{ fontSize: '14px', color: '#F8F8F8', display: 'block', marginBottom: '3px', marginTop: '10px' }}>
                                                    {truncate(item.messages[1].content, 32)}
                                                </span>
                                                <span style={{ display: 'block', fontSize: '10px' }}>
													{new Intl.DateTimeFormat('default', {
														year: 'numeric',
														month: 'short',
														day: 'numeric',
														hour: '2-digit',
														minute: '2-digit',
														hour12: true
													}).format(new Date(item.updated_at * 1000)) || 'No date'} {/* Formats the current date */}
                                                </span>
                                            </div>
                                        </a>
                                        {chatPayload._id === item._id && (
                                            <>
                                                {remove && remove.id === item._id ? (
                                                    <>
                                                        {/* Convert to Bootstrap icons or custom components */}
                                                        <span
                                                            className="position-absolute"
                                                            style={{ right: 45, bottom: 2, color: 'red' }}
                                                            onClick={()=>setRemove({id: '', submit: false})}
                                                        >
                                                            <i className="bi bi-x-circle"></i>
                                                        </span>
                                                        <span
                                                            className="position-absolute"
                                                            style={{ right: 25, bottom: 3, color: '#2C998A' }}
                                                            onClick={()=>setRemove({...remove, submit: true})}
                                                        >
                                                            <i className="bi bi-check-circle-fill"></i>
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        {/* Convert to Bootstrap icons or custom components */}
                                                        <span
                                                            className="position-absolute"
                                                            style={{ right: 45, bottom: 2, color: 'white' }}
                                                            onClick={()=>alert("EDIT")}
                                                        >
                                                            <i className="bi bi-pencil-square"></i>
                                                        </span>
                                                        <span
                                                            className="position-absolute"
                                                            style={{ right: 25, bottom: 3, color: 'white' }}
                                                            onClick={()=>setRemove({id: item._id, submit: false})}
                                                        >
                                                            <i className="bi bi-trash3"></i>
                                                        </span>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


const selectStyle = {
    control: (base: any, state: any) => ({
        ...base,
        backgroundColor: '#334257',
        color: '#BEC9D9',
        border: 'none',  // Removes the border
        boxShadow: state.isFocused ? 0 : base.boxShadow, // Removes the default focus shadow
        '&:hover': {
            border: 'none', // Removes border on hover
        }
    }),
    container: (base: any) => ({
        ...base,
        width: '100%',
    }),
    menu: (base: any) => ({
        ...base,
        backgroundColor: '#334257',
        width: 'calc(100% - 20px)',
    }),
    singleValue: (base: any) => ({
        ...base,
        color: '#BEC9D9',
    }),
    option: (base: any, state: any) => ({
        ...base,
        backgroundColor: state.isSelected ? '#5A6981' : '#334257',
        color: '#BEC9D9',
        ':hover': {
            backgroundColor: state.isSelected ? '#5A6981' : '#475569',
        },
    }),
    dropdownIndicator: (base: any) => ({
        ...base,
        color: '#BEC9D9'
    }),
    clearIndicator: (base: any) => ({
        ...base,
        color: '#BEC9D9'
    }),
};



const SettingsMenu = ({ chatPayload, setChatPayload, type }: any) => {

    return (
        <div className="sidebar-menu" style={{ height: 'calc(100% - 255px)', overflowY: 'auto' }}>
            <div className="sidebarMenuScroll os-host os-theme-dark os-host-overflow os-host-overflow-y os-host-resize-disabled os-host-scrollbar-horizontal-hidden os-host-transition">
                <div className="os-resize-observer-host observed">
                    <div className="os-resize-observer" style={{ left: '0px', right: 'auto' }}></div>
                </div>
                <div className="os-padding">
                    <div className="os-viewport os-viewport-native-scrollbars-invisible" style={{ overflowY: 'scroll' }}>
                        <div className="os-content" style={{ padding: '0px', height: '100%', width: '100%' }}>
                            <ul>
                                {type === 'vectorstore' && (
                                    <li
                                        style={{
                                            display: 'flex',      // Make it a flex container
                                            alignItems: 'center', // Vertically center the child
                                            justifyContent: 'center', // Horizontally center the child
                                            height: '100%',       // Optional, if you want the <li> to fill the container
                                            width: '100%'         // Optional, if you want the <li> to fill the container
                                        }}
                                    >
                                        <div className="input-group px-3 mb-1">
                                            <label className="form-label" style={{ color: "#BEC9D9" }}>Vector Database Provider</label>
                                            <Select
                                                handleChange={(e: any) => setChatPayload({...chatPayload, provider: e.value})}
                                                value={{label: capitalizeFirstLetter(chatPayload.provider), value: chatPayload.provider} || VECTOR_DB_OPTIONS[0]}
                                                options={VECTOR_DB_OPTIONS}
                                                styles={selectStyle}
                                            />
                                        </div>
                                    </li>
                                )}
                                <li
                                    style={{
                                        display: 'flex',      // Make it a flex container
                                        alignItems: 'center', // Vertically center the child
                                        justifyContent: 'center', // Horizontally center the child
                                        height: '100%',       // Optional, if you want the <li> to fill the container
                                        width: '100%'         // Optional, if you want the <li> to fill the container
                                    }}
                                >
                                    <div className="input-group px-3">
                                        <label className="form-label" style={{ color: "#BEC9D9" }}>Model</label>
                                        <Select
                                            handleChange={(e: any) => setChatPayload({...chatPayload, model: e.value})}
                                            value={filterByValue(MODEL_OPTIONS, 'value', chatPayload.model)[0] || MODEL_OPTIONS[0]}
                                            options={MODEL_OPTIONS}
                                            styles={selectStyle}
                                        />
                                    </div>
                                </li>
                                <li
                                    style={{
                                        display: 'flex',      // Make it a flex container
                                        alignItems: 'center', // Vertically center the child
                                        justifyContent: 'center', // Horizontally center the child
                                        height: '100%',       // Optional, if you want the <li> to fill the container
                                        width: '100%'         // Optional, if you want the <li> to fill the container
                                    }}
                                >
                                    <div className="input-group px-3 mt-2">
                                        <div className="container-fluid">
                                            <div className="row">
                                                <div className="col px-0">
                                                    <label className="form-label" style={{ color: "#BEC9D9" }}>Temperature</label>
                                                </div>
                                                <div className="col" style={{ position: 'relative' }}>
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm"
                                                        value={chatPayload.temperature || 0.5}
                                                        disabled
                                                        style={{
                                                            width: '40px',
                                                            height: '10px',
                                                            position: 'absolute',
                                                            right: 0,
                                                            backgroundColor: "#334257",
                                                            color: "#BEC9D9"
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <input
                                            type="range"
                                            className="form-range"
                                            min="0"
                                            max="1"
                                            value={chatPayload.temperature || 0.5}
                                            step="0.1"
                                            onChange={(e) => setChatPayload({...chatPayload, temperature: e.target.value})}
                                            id="customRange2"
                                        />
                                    </div>
                                </li>
                                <li
                                    style={{
                                        display: 'flex',      // Make it a flex container
                                        alignItems: 'center', // Vertically center the child
                                        justifyContent: 'center', // Horizontally center the child
                                        height: '100%',       // Optional, if you want the <li> to fill the container
                                        width: '100%'         // Optional, if you want the <li> to fill the container
                                    }}
                                >
                                    <textarea
                                        className="form-control mx-3 mt-2"
                                        rows={8.5}
                                        onChange={(e) => setChatPayload({...chatPayload, systemMessage: e.target.value})}
                                        value={chatPayload.systemMessage || ''}
                                        style={{ backgroundColor: "#334257", color: "#BEC9D9" }}
                                    ></textarea>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


const FilesMenu = () => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { botAccessToken } = useAuthContext();
    const { files, setFiles } = useLoaderContext();

    // Event handler for file input change
    const handleFileChange = (event: any) => {
        setFiles([...event.target.files]);
    };

    const resetFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset the file input
        }
    };

    const handleSubmit = async () => {
        if (!files || files.length === 0) {
            alert('No files to upload');
            return;
        }

        try {
            const formData = new FormData();
            files.forEach((file: File) => formData.append('files', file, file.name));

            const response = await fetch(`${API_URL}/api/v1/files`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Basic ${botAccessToken}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const responseData = await response.json();
            console.log('Files uploaded successfully', responseData);

            // Reset the file input after successful upload
            resetFileInput();
            setFiles([]);
        } catch (error) {
            console.error('Error uploading files', error);
        }
    };

    return (
        <div className="sidebar-menu">
            <div className="sidebarMenuScroll os-host os-theme-dark os-host-overflow os-host-overflow-y os-host-resize-disabled os-host-scrollbar-horizontal-hidden os-host-transition">
                <div className="os-resize-observer-host observed">
                    <div className="os-resize-observer" style={{ left: '0px', right: 'auto' }}></div>
                </div>
                <div className="os-padding">
                    <div className="os-viewport os-viewport-native-scrollbars-invisible" style={{ overflowY: 'scroll' }}>
                        <div className="os-content" style={{ padding: '0px', height: '100%', width: '100%' }}>
                            <ul>
                                <li>
                                    <div className="px-3">
                                        <label className="form-label" style={{ color: "#BEC9D9" }}>Upload Files</label>
                                        <div className="input-group input-group-sm">
                                            <input
                                                ref={fileInputRef} // Attach the ref to the input
                                                type="file"
                                                className="form-control form-control-sm"
                                                aria-describedby="Upload Files"
                                                aria-label="Upload"
                                                multiple={true}
                                                onChange={handleFileChange}
                                            />
											<button
                                                className="btn btn-outline-success"
                                                type="button"
                                                onClick={handleSubmit}
                                            >
                                                <i className="bi bi-file-check"></i>
											</button>
										</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}