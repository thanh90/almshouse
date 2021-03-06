import React, { useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import { inject } from 'mobx-react';
import supercluster from 'points-cluster';
import { size, map } from 'lodash';
import { observer } from 'mobx-react-lite';

import { markersData } from '../../assets/fakeData'; 

import Marker from './Marker';

const MapContainer = (props) => {
  
    const { MapStore, HomeStore } = props;

    let  clusters = supercluster(
      HomeStore.locations,
      {
        minZoom: 3, // min zoom to generate clusters on
        maxZoom: 15, // max zoom level to cluster the points on
        radius: 60, // cluster radius in pixels
      }
    );
    clusters = size(MapStore.mapProps) ? clusters(MapStore.mapProps) : [];

    HomeStore.setVisibleHouses(clusters);

    clusters = clusters.map(({ wx, wy, numPoints, points }) => ({
      lat: wy,
      lng: wx,
      text: numPoints,
      points,
      id: `${numPoints}_${points[0].id}`,
    }));

    return (<GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyBlqdt2KhGQfEB2wGQ0mvn3nKphR5EehZY' }}
        options={props.options}
        hoverDistance={props.hoverDistance}
        center={props.center}
        zoom={10}
        onChange={MapStore.onChange}
        onChildClick={MapStore.onMarkerClicked}
        yesIWantToUseGoogleMapApiInternals
    >
        {
          clusters.map(({ id, numPoints, ...markerProps }) => <Marker key={id} {...markerProps} />)
        }
    </GoogleMapReact>)
  }

MapContainer.defaultProps = {
  center: {
    lat: 37.567,
    lng: 126.967
  },
  clusterRadius: 500,
  hoverDistance: 30,
  options: {
    minZoom: 3,
    maxZoom: 15,
  }
};


export default inject('MapStore', 'HomeStore')(observer(MapContainer));