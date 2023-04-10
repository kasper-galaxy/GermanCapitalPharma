import { AuthProvider } from 'react-admin';
import myDataProvider from './dataProvider/myDataProvider';
import config from './config';

const dataProvider = myDataProvider(config.API_URL);
const authProvider: AuthProvider = {
    login: () => {
        return Promise.resolve();
    },
    logout: () => {
        localStorage.clear();
        window.location.href = '/';

        return Promise.resolve();
    },
    checkError: () => Promise.resolve(),
    checkAuth: () =>
        dataProvider.checkAuth('users').then(isAuth => { 
            console.log('checkAuth:: ', isAuth);
            if (isAuth) {
                Promise.resolve(); 
            } else {
                localStorage.clear();
                window.location.href = '/';

                return Promise.reject();
            }
        } ).catch(err => {
            console.log(err);
        }),
    getPermissions: () => Promise.reject('Unknown method'),
    getIdentity: () =>
        Promise.resolve({
            id: 'admin',
            fullName: 'GC Pharma',
            avatar:
                `https://ui-avatars.com/api/?background=random&color=random&name=GCPharma`
        }),
};

export default authProvider;
