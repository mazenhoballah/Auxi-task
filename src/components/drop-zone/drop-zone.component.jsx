import React, { useState, useEffect, useRef } from 'react';
import '../drop-zone/drop-zone.styles.css';
import ClearIcon from '@material-ui/icons/Clear';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import pptxgen from 'pptxgenjs';

//d1411f3a-806a-4b8c-8433-f37b2722bdcf

const DropZone = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [validFiles, setValidFiles] = useState([]);
    const [unsupportedFiles, setUnsupportedFiles] = useState([]);
    const fileInputRef = useRef();
    const [selectedValue, setSelectedValue] = React.useState('flowchart');
    const [email, setEmail] = useState('');
    const [pptPath, setPptPath] = useState('');

    useEffect(() => {
        let filteredArray = selectedFiles.reduce((file, current) => {
            const x = file.find((item) => item.name === current.name);
            if (!x) {
                return file.concat([current]);
            } else {
                return file;
            }
        }, []);
        setValidFiles([...filteredArray]);
    }, [selectedFiles]);

    const dragOver = (e) => {
        e.preventDefault();
    };

    const dragEnter = (e) => {
        e.preventDefault();
    };

    const dragLeave = (e) => {
        e.preventDefault();
    };

    const fileDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length) {
            handleFiles(files);
        }
    };

    const handleFiles = (files) => {
        for (let i = 0; i < files.length; i++) {
            if (validateFile(files[i])) {
                setSelectedFiles((prevArray) => [...prevArray, files[i]]);
            } else {
                // add a new property called invalid
                files[i]['invalid'] = true;
                // add to the same array so we can display the name of the file
                setSelectedFiles((prevArray) => [...prevArray, files[i]]);
                // set error message
                setErrorMessage('File type not permitted');
                setUnsupportedFiles((prevArray) => [...prevArray, files[i]]);
            }
        }
    };

    const validateFile = (file) => {
        const validTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/x-icon',
        ];
        if (validTypes.indexOf(file.type) === -1) {
            return false;
        }
        return true;
    };

    const fileSize = (size) => {
        if (size === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(size) / Math.log(k));
        return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const fileType = (fileName) => {
        return (
            fileName.substring(
                fileName.lastIndexOf('.') + 1,
                fileName.length
            ) || fileName
        );
    };
    const removeFile = (name) => {
        // find the index of the item
        // remove the item from array

        const validFileIndex = validFiles.findIndex((e) => e.name === name);
        validFiles.splice(validFileIndex, 1);
        // update validFiles array
        setValidFiles([...validFiles]);
        const selectedFileIndex = selectedFiles.findIndex(
            (e) => e.name === name
        );
        selectedFiles.splice(selectedFileIndex, 1);
        // update selectedFiles array
        setSelectedFiles([...selectedFiles]);
        const unsupportedFileIndex = unsupportedFiles.findIndex(
            (e) => e.name === name
        );
        if (unsupportedFileIndex !== -1) {
            unsupportedFiles.splice(unsupportedFileIndex, 1);
            // update unsupportedFiles array
            setUnsupportedFiles([...unsupportedFiles]);
        }
    };

    const fileInputClicked = () => {
        fileInputRef.current.click();
    };
    const filesSelected = () => {
        if (fileInputRef.current.files.length) {
            handleFiles(fileInputRef.current.files);
        }
    };

    const uploadFiles = () => {
        for (let i = 0; i < validFiles.length; i++) {
            const formData = new FormData();
            formData.append('image', validFiles[i]);
            formData.append('key', '3636b273f1f904fd9b011c21423706fd');
            axios
                .post(
                    'https://api.imgbb.com/1/upload',
                    formData,
                    {
                        onUploadProgress: () => {
                            validFiles.length = 0;
                            setValidFiles([...validFiles]);
                            setSelectedFiles([...validFiles]);
                            setUnsupportedFiles([...validFiles]);
                        },
                    },
                    console.log('Successfully uploaded')
                )

                .catch((err) => {
                    alert('Error Uploading File(s)');
                    console.log(err);
                });
        }
    };

    // const uploadFiles = () => {
    //     for (let i = 0; i < validFiles.length; i++) {
    //         const data = new FormData();
    //         data.append('image', validFiles[i]);
    //         const config = {
    //             headers: { Authorization: 'Client-ID 457219fb373a6ea' },
    //         };

    //         axios
    //             .post('https://api.imgur.com/3/image', data, config)
    //             .then(function (response) {
    //                 console.log(response.data);
    //             })
    //             .catch(function (error) {
    //                 console.log(error);
    //             });
    //     }
    // };

    // const getFiles = () => {
    //     axios({
    //         method: 'get',
    //         url: 'https://api.imgur.com/3/account/mazenHoballah/images/',
    //         headers: { authorization: 'Client-ID 457219fb373a6ea' },
    //     })
    //         .then(function (response) {
    //             console.log(response.data);
    //         })
    //         .catch(function (error) {
    //             console.log(error);
    //         });
    // };

    const handleRadioChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const generatePpt = () => {
        var pptx = new pptxgen();
        var slide = pptx.addSlide();
        slide.addText(`type: ${selectedValue.toString()}`, {
            x: 1.5,
            y: 1.5,
            fontSize: 18,
            color: '363636',
        });
        validFiles.forEach((validFile) => {
            console.log(validFile.toString());
            slide.addImage({ path: validFile.toString() });
        });
        pptx.writeFile({ fileName: 'PowerPoint-Demo.pptx' })
            .then((fileName) => {
                console.log(`created file: ${fileName}`);
            })
            .catch((err) => alert(err.message));
    };

    const sendEmail = () => {
        window.Email.send({
            SecureToken: 'd1411f3a-806a-4b8c-8433-f37b2722bdcf'.toUpperCase(),
            To: email,
            From: 'mazen.hoballah.mh@gmail.com',
            Subject: 'This is the subject',
            Body: 'And this is the body',
            // Attachments: [
            //     {
            //         name: 'test.pptx',
            //         path: pptPath,
            //     },
            // ],
        }).then((message) => {
            alert(message);
            console.log(email);
        });
    };
    return (
        <div className='container'>
            {unsupportedFiles.length === 0 && validFiles.length ? (
                <div>
                    <div className='radio-form' onSubmit={() => uploadFiles()}>
                        <form>
                            <FormControl component='fieldset'>
                                <FormLabel component='legend'>
                                    Choose the slide type you want
                                </FormLabel>
                                <RadioGroup
                                    aria-label='Type'
                                    name='type'
                                    value={selectedValue}
                                    onChange={handleRadioChange}
                                >
                                    <FormControlLabel
                                        value='flowchart'
                                        control={<Radio />}
                                        label='flowchart'
                                    />
                                    <FormControlLabel
                                        value='workflow'
                                        control={<Radio />}
                                        label='workflow'
                                    />
                                </RadioGroup>
                            </FormControl>
                        </form>
                    </div>
                    <div>
                        <h4>Enter your email to receive your slide:</h4>
                        <input
                            type='email'
                            name='email'
                            placeholder='please enter your email'
                            className='email-input'
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className='buttons'>
                        <Button
                            variant='contained'
                            color='primary'
                            className='file-upload-btn'
                            type='submit'
                        >
                            Upload Files
                        </Button>
                        <Button
                            variant='contained'
                            color='secondary'
                            className='generate-ppt-btn'
                            type='button'
                            onClick={() => generatePpt()}
                        >
                            Generate PPT
                        </Button>
                        <Button
                            variant='contained'
                            color='default'
                            className='generate-ppt-btn'
                            type='button'
                            onClick={() => sendEmail()}
                        >
                            Send ppt
                        </Button>
                    </div>
                </div>
            ) : (
                ''
            )}
            {unsupportedFiles.length ? (
                <p>Please remove all unsupported files.</p>
            ) : (
                ''
            )}

            <div
                className='drop-container'
                onDragOver={dragOver}
                onDragEnter={dragEnter}
                onDragLeave={dragLeave}
                onDrop={fileDrop}
                onClick={fileInputClicked}
            >
                <div className='drop-message'>
                    <input
                        ref={fileInputRef}
                        className='file-input'
                        type='file'
                        multiple
                        onChange={filesSelected}
                    />
                    <div className='upload-icon'></div>
                    Drag & Drop files here or click to upload
                </div>
            </div>
            <div className='file-display-container'>
                {validFiles.map((data, i) => (
                    <div className='file-status-bar' key={i}>
                        <div>
                            <div className='file-type-logo'></div>
                            <div className='file-type'>
                                {fileType(data.name)}
                            </div>
                            <span
                                className={`file-name ${
                                    data.invalid ? 'file-error' : ''
                                }`}
                            >
                                {data.name}
                            </span>
                            <span className='file-size'>
                                ({fileSize(data.size)})
                            </span>{' '}
                            {data.invalid && (
                                <span className='file-error-message'>
                                    ({errorMessage})
                                </span>
                            )}
                        </div>
                        <div
                            className='file-remove'
                            onClick={() => removeFile(data.name)}
                        >
                            <ClearIcon />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default DropZone;
