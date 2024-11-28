import * as THREE from 'three';
import {rgbToHex} from './utils.js'
import {parseAmbientLight,parseFog} from './parser.js'


class MyGraph {

	/**
	   constructs the object
	*/
	constructor(scene,json) {
		this.scene = scene
        this.json = json['yasf']
        this.init()
	}
    init(){
       this.parseGlobals(this.json['globals'])
	   this.parseTextures(this.json['textures'])
    }

	parseGlobals(globals){
		this.background = rgbToHex(globals['background'])
		this.ambientLight = parseAmbientLight(globals['ambient'])
		this.scene.fog = parseFog(globals["fog"])
		this.skybox = globals['skybox']
	}
	parseTextures(textures){
		this.textures = Object.entries(textures).reduce((dict, [name, value]) => {
			dict[name] = value.filepath;
			return dict;
		}, {});
	}
	parseMaterials(materials){

	}

}

export { MyGraph };
