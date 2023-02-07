import { FC } from 'react';
import { Draggable, DraggableChildrenFn } from 'react-beautiful-dnd';

export type DraggableItemProps = {
    id: string;
    index: number;
    children: DraggableChildrenFn;
};

export const DraggableItem: FC<DraggableItemProps> = ({ children, id, index }) => {
    return (
        <Draggable draggableId={id} index={index}>
            {children}
        </Draggable>
    );
};
