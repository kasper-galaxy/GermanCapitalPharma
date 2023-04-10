import * as React from 'react';
import { SVGProps } from 'react';
import { useTheme } from '@mui/material/styles';
import logo from '../assets/images/logo.png';

const Logo = (props: SVGProps<SVGSVGElement>) => {
    const theme = useTheme();
    return (
        <img src={logo} alt='logo' style={{height: 52, marginLeft: 16}}/>
    );
};

export default Logo;
