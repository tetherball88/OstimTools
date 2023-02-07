import { FC, useEffect } from 'react';
import { useFormContext, Controller, UseFieldArrayRemove } from 'react-hook-form';
import { DraggableProvided } from 'react-beautiful-dnd';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Badge from '@mui/material/Badge';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

import { ModsToConnect } from '~connectAddon/types';
import { Accordion, AccordionDetails, AccordionSummary, TextFieldDirectory, TextFieldFile } from '~common/ui/components';
import { AddonHubsKeys } from '~common/shared/types';
import { hubPatterns } from '~common/shared/utils';



interface ModsToConnectFieldsProps {
    provided: DraggableProvided
    index: number
    remove: UseFieldArrayRemove
}

export const ModsToConnectFields: FC<ModsToConnectFieldsProps> = ({
    provided,
    index,
    remove
}) => {
    const { control, formState: { errors }, watch, setValue } = useFormContext<ModsToConnect>();
    const valid = !(errors.modsToConnect?.[index]?.name || errors.modsToConnect?.[index]?.path);
    const isGenerated = watch(`modsToConnect.${index}.isGenerated`);

    useEffect(() => {
        if(isGenerated) {
            setValue(`modsToConnect.${index}.selectedHub`, undefined);
        } else {
            setValue(`modsToConnect.${index}.selectedHub`, 'main');
        }
    }, [isGenerated]);

    return (
        <Accordion
            {...provided.draggableProps}
            defaultExpanded={index === 0}
        >

            <AccordionSummary sx={{ paddingLeft: 4 }}>
                <Box
                    ref={provided.innerRef}
                    {...provided.dragHandleProps}

                    sx={{ position: 'absolute', top: 12, left: 5, }}
                >
                    <DragIndicatorIcon />
                </Box>
                <Badge badgeContent="!" color="error" invisible={valid}>
                    <Typography>{watch(`modsToConnect.${index}.name`)} Mod</Typography>
                </Badge>

            </AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Controller
                            name={`modsToConnect.${index}.isGenerated`}
                            control={control}
                            render={({ field: fieldProps }) => (
                                <Tooltip title="Was target mod generated with Ostim Tools and does it contain hub scenes?">
                                    <FormControlLabel
                                        control={<Checkbox {...fieldProps} />}
                                        checked={fieldProps.value}
                                        label="Is generated with Ostim Tools?"
                                    />
                                </Tooltip>
                            )}
                        />
                        <Tooltip title="Remove mod from connecting">
                            <IconButton color="error" onClick={() => remove(index)}>
                                <DeleteForeverIcon />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            name={`modsToConnect.${index}.name`}
                            control={control}
                            render={({ field: fieldProps }) => (
                                <Tooltip title="Custom mod name, so you can understand which path belong to which mod.">
                                    <TextField
                                        {...fieldProps}
                                        fullWidth
                                        label="Mod name(optional)"
                                        error={!!errors.modsToConnect?.[index]?.name}
                                        helperText={errors.modsToConnect?.[index]?.name?.message}
                                    />
                                </Tooltip>
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            name={`modsToConnect.${index}.path`}
                            control={control}
                            render={({ field: fieldProps }) => (
                                isGenerated ? (
                                    <Tooltip title="Generated pack mod path - is where you installed mod with generated ostim animations from Ostim tools.">
                                        <TextFieldDirectory
                                            {...fieldProps}
                                            label="Generated Packs Path"
                                        />
                                    </Tooltip>
                                ) : (
                                    <Tooltip title="Provide path to mod's xml file which you want to be an navigation item in Opensex Addon Hub.">
                                        <TextFieldFile
                                            {...fieldProps}
                                            label="Mod's scene xml path"
                                            filters={[{
                                                name: 'scene xml',
                                                extensions: ['xml']
                                            }]}
                                        />
                                    </Tooltip>
                                )
                            )}
                        />
                    </Grid>
                    {!isGenerated ? (
                        <Grid item xs={12}>
                            <Controller
                                name={`modsToConnect.${index}.selectedHub`}
                                control={control}
                                render={({field: fieldProps}) => (
                                    <FormControl fullWidth>
                                        <InputLabel id="selected-hub">Hubs</InputLabel>
                                        <Select
                                            {...fieldProps}
                                            defaultValue="main"
                                            labelId="selected-hub"
                                            label="Hubs"
                                        >
                                            {
                                                (Object.keys(hubPatterns) as AddonHubsKeys[]).map((key) => {
                                                    return <MenuItem key={key} value={key}>{key}</MenuItem>
                                                })
                                            }
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                    ) : null}
                </Grid>
            </AccordionDetails>
        </Accordion>
    )
}