import { styled, Switch } from "@mui/material";
import { indigo } from "@mui/material/colors";

const OverSwitch = styled(Switch)(() => ({
    padding: 5,
    '& .MuiSwitch-track': {
        backgroundColor: indigo[800],
    },
    '& .MuiSwitch-thumb': {
        boxShadow: 'none',
        width: 10,
        height: 10,
        margin: 3,
        },
    }));

export default OverSwitch;