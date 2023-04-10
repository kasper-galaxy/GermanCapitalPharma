import VisitorIcon from '@mui/icons-material/People';

import UserList from './users.list';
import UserEdit from './users.edit';
import UserCreate from './users.create';
import UserShow from './users.show';

const resource = {
    list: UserList,
    edit: UserEdit,
    create: UserCreate,
    show: UserShow,
    icon: VisitorIcon,
};

export default resource;
