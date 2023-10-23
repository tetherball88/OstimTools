import { Box } from "@mui/material";
import { FieldTemplateProps } from "@rjsf/utils";
import { FC } from "react";

export const CustomFieldTemplate: FC<FieldTemplateProps> = (props) => {
    return (
        <Box className={props.classNames} key={`${props.id}-key`}>
            {props.children}
        </Box>
    )
}
