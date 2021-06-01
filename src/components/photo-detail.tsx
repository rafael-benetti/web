import React from 'react';
import { FiX } from 'react-icons/fi';
import { useCollection } from '../hooks/collection';
import { PhotoDetailContainer } from '../styles/components/photo-detail';
import ContainerWithOpacity from './container-with-opacity';

interface Props {
  photo: File | string;
}

const PhotoDetail: React.FC<Props> = ({ photo }) => {
  // hooks
  const { togglePhotoInfo } = useCollection();

  return (
    <>
      <PhotoDetailContainer>
        <img
          src={typeof photo === 'string' ? photo : URL.createObjectURL(photo)}
          alt=""
        />
        <button type="button" onClick={() => togglePhotoInfo(undefined)}>
          <FiX />
        </button>
      </PhotoDetailContainer>
      <ContainerWithOpacity showContainer={() => togglePhotoInfo(undefined)} />
    </>
  );
};
export default PhotoDetail;
