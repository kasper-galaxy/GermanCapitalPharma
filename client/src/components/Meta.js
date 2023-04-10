import React from 'react';
import { Helmet } from 'react-helmet';

const Meta = ({ title, description, keywords }) => {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name='description' content={description} />
            <meta name='keyword' content={keywords} />
        </Helmet>
    );
};

Meta.defaultProps = {
    title: 'German Capital Pharma GmbH',
    description: 'Global leader in pharmaceutical services and consulting',
    keywords: 'Pharmaceutical, German Captial Pharma, B2B'
    
};

export default Meta;