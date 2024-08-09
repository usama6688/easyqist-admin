import React from 'react';
import "./ImageViewer.css";

const getFileData = (file) => {
    if (typeof file === 'string') {
        return file
    };

    var binaryData = [];
    binaryData.push(file);
    return URL.createObjectURL(new Blob(binaryData))
};

const ImageViewer = ({ src, className, ...others }) => {
    return (
        <div className='ImageViewerDiv'>
            <img src={getFileData(src)} className={className}  {...others} />
        </div>
    )
}

export default ImageViewer;