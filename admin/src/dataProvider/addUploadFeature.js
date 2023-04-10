import { CollectionsOutlined } from "@mui/icons-material";
import { HttpError } from "react-admin";
import config from "../config";

/**
 * For posts update only, convert uploaded image in base 64 and attach it to
 * the `picture` sent property, with `src` and `title` attributes.
 */
 const addUploadCapabilities = dataProvider => ({
    ...dataProvider,
    create: (resource, params) => {
        console.log('create params data ', params.data);

        if (resource === 'users') {
            // Multipart/Form-Data
            const businessLicense = params.data.businessLicense ? [params.data.businessLicense] : [];
            const officialDocument = params.data.officialDocument ? [params.data.officialDocument] : [];
            const additionalDocument = params.data.additionalDocument ? params.data.additionalDocument : [];

            return Promise.all([businessLicense, officialDocument, additionalDocument])
                .then(([businessLicense, officialDocument, additionalDocument]) => {
                    const formData = getFormDataFromObject(params.data);
                    formData.delete('businessLicense');
                    formData.delete('officialDocument');
                    formData.delete('additionalDocument');
                    if (businessLicense.length > 0) {
                        formData.append('businessLicense', businessLicense[0].rawFile);
                    }
                    if (officialDocument.length > 0) {
                        formData.append('officialDocument', officialDocument[0].rawFile);
                    }
                    additionalDocument.map(doc => {
                        formData.append('additionalDocument', doc.rawFile);
                    })
                    return formData;
                }
                )
                .then(formData => {
                    return fetchForm(`${config.API_URL}/${resource}`, {
                        method: 'POST',
                        body: formData,
                    }).then((response) => {
                        if (!response.ok) {
                            return response.text()
                            .then((text) => {
                    
                            // if the error is an object and you just want to display some elements:
                            throw(JSON.parse(text));
                            });
                        }
                        return response.json();
                    }).then((res) => {
                            return {
                            data: { ...res },
                        }
                    }).catch((err) => {
                        console.log('err', err);
                        throw new Error(err.message);
                        // return Promise.reject(new HttpError(err));
                    })
                    // return dataProvider.create(resource, params);
                }           
                );
        } else if (resource === 'products') {
            console.log('products');
            const images = params.data.images ? params.data.images : [];
            return Promise.all(images)
                .then((images) => {
                    // Prepare Form Data
                    const formData = getFormDataFromObject(params.data);
                    formData.delete('images');
                    console.log('images ', images);
                    images.map(image => {
                        console.log('image ', image);
                        formData.append('images', image.rawFile);
                    });
                    return formData; })
                .then(formData => {
                    return fetchForm(`${config.API_URL}/${resource}`, {
                        method: 'POST',
                        body: formData
                    }).then((response) => {
                        if (!response.ok) {
                            return response.text()
                            .then((text) => {
                                throw(JSON.parse(text));
                            });
                        }
                        return response.json();
                    }).then((res) => ({
                        data: { ...res },
                    })).catch((err) => {
                        throw new Error(err.message);
                    });
                });
        }
        // fallback to the default implementation
        return dataProvider.create(resource, params);
    },
    update: (resource, params) => {
        console.log('update params.data ', params.data);
        if (resource === 'users') {
            // params.data.businessLicense null - remove on admin panel
            // not NULL
            // if rawFile   upload new one
            // no rawFile   use old one
            // Multipart/Form-Data
            const businessLicenseFile = params.data.businessLicense ? [params.data.businessLicense] : [];
            const officialDocumentFile = params.data.officialDocument ? [params.data.officialDocument] : [];
            const additionalDocumentFile = params.data.additionalDocument ? params.data.additionalDocument : [];

            return Promise.all([businessLicenseFile, officialDocumentFile, additionalDocumentFile])
                .then(([businessLicense, officialDocument, additionalDocument]) => {
                    const formData = getFormDataFromObject(params.data);
                    formData.delete('businessLicense');
                    formData.delete('officialDocument');
                    formData.delete('additionalDocument');
                    let businessLicenseStatus = 'UPDATE';
                    let officialDocumentStatus = 'UPDATE';
                    
                    // Business License
                    if (businessLicense.length > 0) {   // OLD, UPDATE
                        if (businessLicense[0].rawFile) {   // UPDATE
                            formData.append('businessLicense', businessLicense[0].rawFile);
                        } else { // OLD
                            businessLicenseStatus = 'OLD';
                        }
                    } else {    // REMOVE
                        businessLicenseStatus = 'REMOVE';
                    }

                    // Official Document
                    if (officialDocument.length > 0) {   // OLD, UPDATE
                        if (officialDocument[0].rawFile) {   // UPDATE
                            formData.append('officialDocument', officialDocument[0].rawFile);
                        } else { // OLD
                            officialDocumentStatus = 'OLD';
                        }
                    } else {    // REMOVE
                        officialDocumentStatus = 'REMOVE';
                    }
                    
                    // Additional Document
                    if (additionalDocument.length > 0) {   // OLD, UPDATE
                        additionalDocument.map(doc => {
                            if (doc.rawFile) {
                                formData.append('additionalDocument', doc.rawFile);
                            } else {
                                console.log('old Additional ', doc);
                                formData.append('oldAdditionalDocument', JSON.stringify(doc));
                            }
                        });
                    }

                    formData.append('businessLicenseStatus', businessLicenseStatus);
                    formData.append('officialDocumentStatus', officialDocumentStatus);

                    return formData;
                }
                )
                .then(formData => {
                    return fetchForm(`${config.API_URL}/${resource}/${params.id}`, {
                        method: 'PUT',
                        body: formData,
                    }).then((response) => {
                        if (!response.ok) {
                            return response.text()
                            .then((text) => {
                    
                            // if the error is an object and you just want to display some elements:
                            throw(JSON.parse(text));
                            });
                        }
                        return {
                        data: { ...params.data },
                    }}).catch((err) => {
                        console.log('err', err);
                        throw new Error(err.message);
                        // return Promise.reject(new HttpError(err));
                    })
                    // return dataProvider.create(resource, params);
                }           
                );
        } else if (resource === 'products') {
            console.log('products');
            const images = params.data.images ? params.data.images : [];

            return Promise.all(images)
                .then((images) => {
                    // Prepare Form Data
                    const formData = getFormDataFromObject(params.data);
                    formData.delete('images');
                    console.log('images ', images);
                    images.map(image => {
                        console.log('image ', image);
                        if (image.rawFile) {
                            formData.append('images', image.rawFile);
                        } else {
                            formData.append('oldImages', JSON.stringify(image));
                        }
                    });
                    return formData; })
                .then(formData => {
                    return fetchForm(`${config.API_URL}/${resource}/${params.id}`, {
                        method: 'PUT',
                        body: formData
                    }).then((response) => {
                        if (!response.ok) {
                            return response.text()
                            .then((text) => {
                                throw(JSON.parse(text));
                            });
                        }
                        return {
                        data: { ...params.data },
                    }}).catch((err) => {
                        throw new Error(err.message);
                    });
                });
        }
        // fallback to the default implementation
        return dataProvider.update(resource, params);
    },
});

/**
 * Convert a `File` object returned by the upload input into a base 64 string.
 * That's not the most optimized way to store images in production, but it's
 * enough to illustrate the idea of data provider decoration.
 */
const convertFileToBase64 = file =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.rawFile);

        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
    });

const fetchForm = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'multipart/form-data' });
    }
    // add your own headers here
    const token = localStorage.getItem('admin-token');
    options.headers.set('Authorization', `Bearer ${token}`);
    return fetch(url, options);
}

function getFormDataFromObject(object) {
    const formData = new FormData();
    Object.keys(object).forEach(key => {
        if (typeof object[key] !== 'object') formData.append(key, object[key])
        else formData.append(key, JSON.stringify(object[key]))
    })
    return formData;
}

export default addUploadCapabilities;
