import OrderIcon from '@mui/icons-material/AttachMoney';
import OrderCreate from './orders.create';
import OrderEdit from './orders.edit';
import OrderList from './orders.list';
import OrderShow from './orders.show';

const resource = {
    icon: OrderIcon,
    list: OrderList,
    edit: OrderEdit,
    show: OrderShow,
    create: OrderCreate,
}

export default resource;