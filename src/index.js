import './index.css'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

import 'ol/ol.css';

import 'maplibre-gl/dist/maplibre-gl.css'
import maplibregl from 'maplibre-gl'

import * as pmtiles from "pmtiles";


let protocol = new pmtiles.Protocol();
maplibregl.addProtocol("pmtiles", protocol.tile);


const maplibreMap = new maplibregl.Map({
    container: 'maplibreMap',
    style: 'gp.json'
});

const rawMap = new maplibregl.Map({
    container: 'rawMap',
    style: 'gp_raw.json'
});
