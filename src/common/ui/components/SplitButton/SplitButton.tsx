import { FC, ReactNode, useRef, useState } from 'react';

import Button, { ButtonProps } from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Tooltip from '@mui/material/Tooltip';

import { MapInvokers } from '~common/ui/hooks/useSendCommand';

export type SplitButtonOptionType = {
    command: keyof MapInvokers;
    tooltip: string;
    text: string;
    message: string;
    options?: SplitButtonOptionType[];
    confirm?: ReactNode;
}

interface SplitButtonProps {
    button: SplitButtonOptionType
    arrowTooltip?: string
    color?: ButtonProps['color']
    variant?: ButtonProps['variant']
    onClick: (button: SplitButtonOptionType) => () => void
    sx?: ButtonProps['sx'],
    disabled?: boolean
}

export const SplitButton: FC<SplitButtonProps> = ({ button, onClick, arrowTooltip = '', color = 'primary', variant = 'contained', sx, disabled = false }) => {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLDivElement>(null);

    const handleMenuItemClick = (option: SplitButtonOptionType) => () => {
        onClick(option)();
        setOpen(false);
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: Event) => {
        if (
            anchorRef.current &&
            anchorRef.current.contains(event.target as HTMLElement)
        ) {
            return;
        }

        setOpen(false);
    };

    return (
        <>
            <ButtonGroup
                ref={anchorRef}
                aria-label="split button"
                color={color}
                variant={variant}
                sx={sx}
                disabled={disabled}
            >
                <Tooltip key={button.command} title={disabled ? '' : button.tooltip}>
                    <Button onClick={onClick(button)}>
                        {button.text}
                    </Button>
                </Tooltip>
                <Tooltip title={disabled ? '' : arrowTooltip}>
                    <Button
                        size="small"
                        aria-controls={open ? 'split-button-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-label="select merge strategy"
                        aria-haspopup="menu"
                        onClick={handleToggle}
                    >
                        <ArrowDropDownIcon />
                    </Button>
                </Tooltip>

            </ButtonGroup>
            <Popper
                sx={{
                    zIndex: 1,
                }}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                placement='bottom-end'
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin:
                                placement === 'bottom-end' ? 'right top' : 'center bottom',
                        }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList id="split-button-menu" autoFocusItem>
                                    {button.options?.map((option) => (
                                        <Tooltip key={option.command} title={disabled ? '' : option.tooltip}>
                                            <MenuItem
                                                onClick={handleMenuItemClick(option)}
                                            >
                                                {option.text}
                                            </MenuItem>
                                        </Tooltip>

                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </>
    );
}