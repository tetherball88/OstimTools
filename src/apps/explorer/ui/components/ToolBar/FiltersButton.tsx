import { Button, Popover, Tooltip } from "@mui/material"
import { useState } from 'react'
import { Filters } from "~explorer/ui/components/Filters/Filters";
import FilterAltIcon from '@mui/icons-material/FilterAlt';

export const FiltersButton = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Tooltip title="Filter scenes on canvas">
                <Button onClick={handleClick}><FilterAltIcon /></Button>
            </Tooltip>

            <Popover
                open={!!anchorEl}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Filters />
            </Popover>
        </>
    )
}