import * as THREE from 'three';
import {rgbToHex} from './utils.js'
import {parseAmbientLight,parseFog, parseSkybox,parseTextures,parseMaterials} from './parser.js'


class Node {

	/**
	   constructs the object
	*/
	constructor(json) {
        this.json = json
        this.edges = json ["children"]["nodesList"]
        this.transforms = json ["transforms"]
        this.init()
	}



}

export { Node };