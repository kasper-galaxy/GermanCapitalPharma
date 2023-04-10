import * as React from 'react';
import PropTypes from 'prop-types';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { Button, Loading, useGetMany, useNotify, useUnselectAll } from 'react-admin';
import JsZip from 'jszip';
import FileSaver from 'file-saver';

const DownloadInvoiceZip = ({ ...props }) => {
    const { resources, selectedIds } = props;
    const notify = useNotify();
    const unselectAll = useUnselectAll(resources);
    const { data, isLoading, error } = useGetMany(
        'invoices',
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
            
            Promise.all(data.map(invoice => {
                console.log('invoice ', invoice);
                if (invoice.url) {
                    return {
                        name: `${invoice.id}`,
                        invoicePDF : download(invoice.url),
                    };
                }
                return {};
            })).then(blobs => {
                const zip = JsZip();
                const folder = zip.folder('invoices');
                blobs.map(blob => {
                    console.log('blob ', blob);
                    if (blob.name) {
                        folder?.file(blob.name+'.pdf', blob.invoicePDF);
                    }
                });
                zip.generateAsync({type: 'blob'}).then(zipFile => {
                    const currentDate = new Date().getTime();
                    const fileName = `invoice-${currentDate}.zip`;
                    return FileSaver.saveAs(zipFile, fileName);
                });
            });
            
        }
    }

    return (
        <Button
            label='resources.invoices.actions.download_invoice_zip'
            disabled={isLoading}
            onClick={downloadZip}
        >
            <CloudDownloadIcon />
        </Button>
    );
};

DownloadInvoiceZip.propTypes = {
    label: PropTypes.string,
    resource: PropTypes.string.isRequired,
    selectedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default DownloadInvoiceZip;