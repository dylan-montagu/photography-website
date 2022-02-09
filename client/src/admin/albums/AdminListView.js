import React, { Fragment } from 'react';
import styled from '@emotion/styled';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { arrayMoveImmutable } from '../../util/arrayMove';

const PhotoItem = styled.div`
  width: 200px;
  margin-bottom: 1px;
  // padding: 1px;
`;

function DraggablePhoto({ photo, index }) {
  return (
    <Draggable draggableId={photo._id} index={index}>
      {(provided) => (
        <PhotoItem
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <img
            src={photo.urlMedium}
            width={photo.listWidth}
            height={photo.listHeight}
            alt={photo.description}
          ></img>
        </PhotoItem>
      )}
    </Draggable>
  );
}

const AdminListView = ({ photos, setPhotos }) => {
  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }
    if (result.destination.index === result.source.index) {
      return;
    }
    const reorderedPhotos = arrayMoveImmutable(
      photos,
      result.source.index,
      result.destination.index
    );
    setPhotos(reorderedPhotos);
  }

  return (
    <Fragment>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='list'>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {photos.map((photo, index) => {
                return (
                  <DraggablePhoto
                    photo={photo}
                    index={index}
                    key={photo._id}
                  ></DraggablePhoto>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Fragment>
  );
};

export default AdminListView;
