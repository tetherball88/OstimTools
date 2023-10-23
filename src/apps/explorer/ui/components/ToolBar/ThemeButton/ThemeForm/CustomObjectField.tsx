import { FC } from 'react'
import { ObjectFieldTemplateProps } from '@rjsf/utils'
import { Accordion, AccordionDetails, AccordionDetailsProps, AccordionProps, AccordionSummary, AccordionSummaryProps } from '@mui/material'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';

const CustomAccordion: FC<AccordionProps> = (props) => (
    <Accordion
        {...props}
        elevation={0}
        square
        sx={theme => ({
            border: `1px solid ${theme.palette.divider}`,
            '&:not(:last-child)': {
                borderBottom: 0,
            },
            '&:before': {
                display: 'none',
            },
        })}
    />
)

const CustomAccordionSummary: FC<AccordionSummaryProps> = props => (
    <AccordionSummary
        {...props}
        sx={(theme) => ({
            backgroundColor: 'rgba(0, 0, 0, .03)',
            flexDirection: 'row-reverse',
            '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                transform: 'rotate(90deg)',
            },
            '& .MuiAccordionSummary-content': {
                '&, &.Mui-expanded': {
                    marginLeft: theme.spacing(1),
                },
            },
        })}
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    />
)

const CustomAccordionDetails: FC<AccordionDetailsProps> = props => (
    <AccordionDetails
        {...props}
        sx={theme => ({
            padding: theme.spacing(2),
            borderTop: '1px solid rgba(0, 0, 0, .125)'
        })}
    />
            
)

export const CustomObjectField: FC<ObjectFieldTemplateProps> = props => {
    return (
        <CustomAccordion id={props.idSchema.$id}>
            <CustomAccordionSummary>
                {props.title || props.schema.title}
            </CustomAccordionSummary>
            <CustomAccordionDetails>
                {
                    props.properties.map(({ content }) => content)
                }
            </CustomAccordionDetails>
        </CustomAccordion>

    )
}