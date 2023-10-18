import { FC } from 'react';
import { useConfirm } from "material-ui-confirm";

import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export interface ConfirmRemoveButtonProps {
    onConfirm: () => void
    tooltip: string
}

export const ConfirmRemoveButton: FC<ConfirmRemoveButtonProps> = ({ onConfirm, tooltip }) => {
    const confirmHandler = useConfirm();

    const onClick = async () => {
        try {
            await confirmHandler({ description: 'You are gonna remove config files permanently, there is no undo option.' });
            onConfirm();
        // eslint-disable-next-line no-empty
        } catch {}
    }

    return (
        <div>
            <Tooltip title={tooltip}>
                <IconButton color="error" onClick={onClick}>
                    <DeleteForeverIcon />
                </IconButton>
            </Tooltip>
        </div>
    );
}