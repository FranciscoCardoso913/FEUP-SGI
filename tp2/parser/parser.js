import {rgbToHex} from './utils.js'
import * as THREE from 'three';


export function parseAmbientLight(ambient){
    const color = rgbToHex(ambient)
    return new  THREE.AmbientLight(color)
}

export function parseFog(fog){
    const color = rgbToHex(fog["color"])
    return new THREE.Fog(color, fog["near"], fog["far"]);
}