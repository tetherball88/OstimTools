import { FC, useEffect, useRef, useState } from 'react';
import { DropResult } from 'react-beautiful-dnd';

import { Alert, Box } from '@mui/material';

import { ModsToConnectField } from '~connectAddon/types';
import { DraggableContainer, DraggableItem } from '~common/ui/components';
import { ModsToConnectFields } from '~connectAddon/ui/components';

interface ModsToConnectFormProps {
    arrayField: ModsToConnectField
}

export const ModsToConnectForm: FC<ModsToConnectFormProps> = ({ arrayField }) => {
    const [width, setWidth] = useState<number>(0);
    const ref = useRef<HTMLDivElement>();

    useEffect(() => {
        if (ref.current) {
            setWidth(ref.current.getBoundingClientRect().width)
        }
    }, [ref.current])

    const onDragEnd = ({ destination, source }: DropResult) => {
        // dropped outside the list
        if (!destination) return;

        arrayField.swap(source.index, destination.index);
    }

    return (
        <DraggableContainer onDragEnd={onDragEnd}>
            <Box ref={ref} />
            {
                !arrayField.fields.length ? (
                    <Alert severity='info'>Please add mods you want to connect with addon hub.</Alert>
                ) : null
            }
            {
                arrayField.fields.map((field, index) => (
                    <DraggableItem
                        key={field.id}
                        id={field.id}
                        index={index}
                    >
                        {(provided) => {
                            provided.draggableProps.style = { ...provided.draggableProps.style, width } as any
                            return (
                                <ModsToConnectFields
                                    provided={provided}
                                    index={index}
                                    remove={arrayField.remove}
                                />
                            )
                        }}
                    </DraggableItem>
                ))
            }
        </DraggableContainer >
    )
}