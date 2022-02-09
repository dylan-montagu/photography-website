import React from 'react';
import Gallery from 'react-photo-gallery';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

import { arrayMoveImmutable } from '../../util/arrayMove';
import AdminGridPhoto from './AdminAlbumPhotoGalleryElement';

/* popout the browser and maximize to see more rows! -> */
const SortablePhoto = SortableElement((item) => {
  item.photo.removePhotoFromView = item.removePhotoFromView;
  return <AdminGridPhoto {...item} />;
});
const SortableGallery = SortableContainer(({ items, removePhotoFromView }) => {
  return (
    <Gallery
      photos={items}
      targetRowHeight={150}
      renderImage={(props) => (
        <SortablePhoto {...props} removePhotoFromView={removePhotoFromView} />
      )}
    />
  );
});

const AdminGridView = ({ photos, setPhotos }) => {
  const removePhotoFromView = (photoId) => {
    setPhotos(photos.filter((photo) => !(photo._id === photoId)));
  };

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setPhotos(arrayMoveImmutable(photos, oldIndex, newIndex));
  };

  return (
    <div>
      <SortableGallery
        removePhotoFromView={removePhotoFromView}
        items={photos}
        onSortEnd={onSortEnd}
        axis={'xy'}
      ></SortableGallery>
    </div>
  );
};

export default AdminGridView;
