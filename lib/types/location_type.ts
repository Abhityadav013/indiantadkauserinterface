/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Location {
    lat: number;
    lon: number;
    display_name: string;
    place_id?: string;
    licence?: string;
    osm_type?: string;
    osm_id?: string;
    boundingbox?: string[];
    class?: string;
    type?: string;
    importance?: number;
    icon?: string;
  }
  
  export type PostCodePlace = {
    'place name': string;
    longitude: string;
    state: string;
    'state abbreviation': string;
    latitude: string;
  };
  
  export type Element = {
    type: 'way' | string;
    id: number;
    tags: {
      highway?: string;
      lane_markings?: string;
      maxspeed?: string;
      name?: string;
      priority_road?: string;
      ref?: string;
      surface?: string;
      [key: string]: any; // in case there are more optional tag fields
    };
  };
  
  export type RoadElementsResponse = {
    elements: Element[];
  };
  