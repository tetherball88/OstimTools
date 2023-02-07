import { FC, useState } from 'react';

import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';

interface TextFieldArrayProps {
    label: string
    values: string[]
    onAdd: (newItems: string[], addItems: string[]) => void
    onRemove: (newItem: string[], removedItem: string) => void
}

export const TextFieldArray: FC<TextFieldArrayProps> = ({ label, values, onAdd, onRemove }) => {
    const [val, setVal] = useState('');

    const removeHandler = (item: string) => {
        const arr = values.filter(curr => curr !== item);
        onRemove(arr, item);
    }

    const addHandler = () => {
        const formattedVal = val.replace(/\s/g, ',').replace(/,+/g, ',').replace(/[^\w-,]/g, '');
        const arr = formattedVal.split(',').filter(v => !!v);
        onAdd([...new Set(values.concat(arr))], arr);
        setVal('');
    }

    return (
        <Grid container spacing={2} sx={{ paddingTop: '16px' }}>
            <Grid item xs={12}>
                <Tooltip title="This field works with list like values. You can add them one by one or provide string with words separated by ',' Hit eneter or press + to add value from the input">
                    <TextField
                        fullWidth
                        multiline
                        label={label}
                        value={val}
                        onKeyDown={e => {
                            if (e.key == 'Enter') {
                                addHandler();
                            }
                        }}
                        onChange={(event) => setVal(event.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton color="primary" onClick={addHandler}><AddIcon /></IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </Tooltip>
            </Grid>
            <Grid item xs={12}>
                {values.map(item => <Chip key={item} sx={{ marginRight: '3px', marginBottom: '5px' }} size='small' label={item} onDelete={() => removeHandler(item)} />)}
            </Grid>
        </Grid>
    )
}