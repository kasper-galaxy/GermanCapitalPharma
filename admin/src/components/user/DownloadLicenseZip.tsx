import * as React from 'react';
import PropTypes from 'prop-types';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { Button, Loading, useGetMany, useNotify, useUnselectAll } from 'react-admin';
import JsZip from 'jszip';
import FileSaver from 'file-saver';

const DownloadLicenseZip = ({ ...props }) => {
    const { resources, selectedIds } = props;
    const notify = useNotify();
    const unselectAll = useUnselectAll(resources);
    const { data, isLoading, error } = useGetMany(
        'users',
        { ids: selectedIds }
    );

    const download = (url: string) => {
        return fetch(url).then(resp => resp.blob());
    };

    const downloadMany = (urls: string[], files_per_group = 5) => {
        return Promise.all(urls.map(url => download(url)));
    };

    if (isLoading) {
        return (
            <Loading />
        );
    } 

    if (error) {
        notify(error.message, { type: 'error' });
    }

    const downloadZip = () => {
        if (data) {
            let folders = [];
            folders.length = data.length;
            
            Promise.all(data.map(user => {
                console.log('user ', user);
                return {
                    name: `${user.nameFirst}_${user.nameLast}`,
                    ...(user.businessLicense) && { businessLicense : download(user.businessLicense.url), businessLicenseTitle: user.businessLicense.title },
                    ...(user.officialDocument) && { officialDocument : download(user.officialDocument.url), officialDocumentTitle: user.officialDocument.title },
                };
            })).then(blobs => {
                const zip = JsZip();
                blobs.map(blob => {
                    console.log('blob ', blob);
                    if (blob.businessLicense || blob.officialDocument) {
                        const folder = zip.folder(blob.name);
                        if (blob.businessLicense) {
                            folder?.file(blob.businessLicenseTitle, blob.businessLicense);
                        }
                        if (blob.officialDocument) {
                            folder?.file(blob.officialDocumentTitle, blob.officialDocument);
                        }
                    }
                });
                zip.generateAsync({type: 'blob'}).then(zipFile => {
                    const currentDate = new Date().getTime();
                    const fileName = `license-${currentDate}.zip`;
                    return FileSaver.saveAs(zipFile, fileName);
                });
            });
            
        }
    }

    return (
        <Button
            label='resources.users.actions.download_license_zip'
            disabled={isLoading}
            onClick={downloadZip}
        >
            <CloudDownloadIcon />
        </Button>
    );
};

DownloadLicenseZip.propTypes = {
    label: PropTypes.string,
    resource: PropTypes.string.isRequired,
    selectedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default DownloadLicenseZip;