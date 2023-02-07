import { FC, PropsWithChildren } from 'react';
import {
  DragDropContext,
  Droppable,
  OnDragEndResponder
} from 'react-beautiful-dnd';

export type DraggableContainerProps = {
  onDragEnd: OnDragEndResponder;
};

export const DraggableContainer: FC<PropsWithChildren<DraggableContainerProps>> = ({ children, onDragEnd }) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable-list">
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {children}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
