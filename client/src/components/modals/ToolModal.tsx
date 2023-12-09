import React, { useState } from 'react';
import ToolSelect from "../sections/ToolSelect"; // Adapted for standard Bootstrap
import { BASIC_TOOLS, OPENAI_TOOLS, PINECONE_TOOLS } from "../../config/tools";

export default function ToolModal() {
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState(0); // State to manage active tab

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const tabItems = [
        { name: 'Basic', icon: 'bi-calculator' },
        // { name: 'OpenAI', icon: 'bi-brain' },
        { name: 'Pinecone', icon: 'bi-cone-striped' },
    ];

    const toolSections = [
        <ToolSelect tools={BASIC_TOOLS} />,
        // <ToolSelect tools={OPENAI_TOOLS} />,
        <ToolSelect tools={PINECONE_TOOLS} />,
    ];

    return (
        <>

            <a href="#" onClick={handleShow}>
                <i className="bi bi-tools"></i>
                <span>Tools</span>
            </a>

            <div className={"modal fade" + (showModal ? " modal-backdrop-show show" : "")} tabIndex={-1} style={{ display: showModal ? 'block' : 'none' }}>
                <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header d-flex align-items-center">
                            <ul className="nav nav-tabs">
                                {tabItems.map((tab, index) => (
                                    <li className="nav-item" key={index}>
                                        <button
                                            className={`nav-link ${index === activeTab ? 'active' : ''}`}
                                            onClick={() => setActiveTab(index)}
                                        >
                                            {tab.icon && <i className={tab.icon} style={{ marginRight: '5px' }} />}
                                            {tab.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="modal-body">
                            {toolSections[activeTab]}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleClose}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
