import { CardMedia, Grid } from "@mui/material";
import { useRecordContext } from "react-admin";
import { Product } from "../../types";

const ProductImageInputField = ({...props}) => {
    const record = useRecordContext<Product>(props);
    if (!record)    return null;
    console.log(record);
    return (
            <CardMedia
                component="img"
                image={record.url ? record.url : record.undefined}
                alt=""
                sx={{ maxWidth: '16em', maxHeight: '16em' }}
            />
    );
};

export default ProductImageInputField;