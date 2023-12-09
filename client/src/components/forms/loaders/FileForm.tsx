import React from 'react';
import { useAppContext } from "../../../contexts/AppContext";
import { useLoaderContext } from "../../../contexts/LoaderContext";

export default function FileForm() {
    const { loading } = useAppContext();
    const { handleFileChange, formData } = useLoaderContext();

    return (
        <form>
            <div className="mb-3">
                <label htmlFor="fileInput" className="form-label">Files</label>
                <input
                    id="fileInput"
                    className="form-control form-control-sm"
                    type="file"
                    disabled={loading}
                    onChange={handleFileChange}
                    value={formData.files}
                    multiple
                />
                <div className="form-text">
                    Supported file types: .txt, .pdf, .html, .md
                </div>
            </div>
        </form>
    );
}