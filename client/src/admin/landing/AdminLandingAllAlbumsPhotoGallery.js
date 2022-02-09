import React from 'react';
import Gallery from 'react-photo-gallery';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

import { arrayMoveImmutable } from '../../util/arrayMove';
import AdminLandingAllAlbumsPhotoGalleryElement from './AdminLandingAllAlbumsPhotoGalleryElement';

/* popout the browser and maximize to see more rows! -> */
const SortablePhoto = SortableElement((item) => {
  item.photo.removePhotoFromView = item.removePhotoFromView;
  return <AdminLandingAllAlbumsPhotoGalleryElement {...item} />;
});
const SortableGallery = SortableContainer(({ items, removePhotoFromView }) => {
  return (
    <Gallery
      photos={items}
      targetRowHeight={200}
      renderImage={(props) => (
        <SortablePhoto {...props} removePhotoFromView={removePhotoFromView} />
      )}
    />
  );
});

const AdminLandingAllAlbumsPhotoGallery = ({ albums, setAlbums }) => {
  const removePhotoFromView = (photoId) => {
    setAlbums(albums.filter((photo) => !(photo._id === photoId)));
  };

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setAlbums(arrayMoveImmutable(albums, oldIndex, newIndex));
  };

  return (
    <div>
      <SortableGallery
        removePhotoFromView={removePhotoFromView}
        items={albums}
        onSortEnd={onSortEnd}
        axis={'xy'}
      ></SortableGallery>
    </div>
  );
};

export default AdminLandingAllAlbumsPhotoGallery;
