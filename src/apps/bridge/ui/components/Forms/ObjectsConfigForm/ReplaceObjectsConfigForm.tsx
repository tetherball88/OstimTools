import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Grid, TextField, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { ModuleSpecificConfig } from "~bridge/types";
import { TextFieldControlled } from "~common/ui/components/Fields/TextFieldControlled";

interface ReplaceObjectsConfigFormProps {
    moduleObjects: Record<string, string[]>
}

export const ReplaceObjectsConfigForm: FC<ReplaceObjectsConfigFormProps> = ({ moduleObjects }) => {
    const { getValues } = useFormContext<ModuleSpecificConfig>();
    const replaceObjects = getValues('objects.replaceObjects');

    return (
        <Box>
            <Alert severity='info'>Here you can set if you want to switch anim objects(you should have them in plugin(esp) files)</Alert>
            <Alert severity='warning'>If you added replacer and selected original object in skip tab - this object will be skipped anyway</Alert>
            {
                Object.entries(moduleObjects).map(([name, objects]) => (
                    <Box key={name}>
                        <Accordion sx={{ marginTop: 1 }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>{name}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {objects.map((obj) => {
                                return (
                                    <Grid container key={obj}>
                                        <Grid item xs={4}>
                                            <TextField disabled value={obj} />
                                        </Grid>
                                        <Grid item xs={8}>
                                            <TextFieldControlled
                                                formControl={{
                                                    name: `objects.replaceObjects.${name}.${obj}`
                                                }}
                                                value={replaceObjects?.[name]?.[obj] || ""}
                                            />
                                        </Grid>
                                    </Grid>
                                )
                            })}
                        </AccordionDetails>
                    </Accordion>
                    </Box>
                    
                ))
            }
        </Box>
    )
}