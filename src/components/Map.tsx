/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import {
  withGoogleMap,
  GoogleMap,
  withScriptjs,
  Marker,
} from 'react-google-maps';
import { MapContainer } from '../styles/components/map';

interface Props {
  initialPoint: { lat: number; lng: number };
  endPoint: { lat: number; lng: number };
}

const Map: React.FC<Props> = ({ initialPoint, endPoint }) => {
  return (
    <MapContainer>
      <GoogleMap defaultZoom={17} defaultCenter={initialPoint}>
        <Marker position={initialPoint} defaultTitle="Ponto inicial" />
        <Marker position={endPoint} defaultTitle="Ponto final" />
      </GoogleMap>
    </MapContainer>
  );
};

export default withScriptjs(withGoogleMap(Map));
