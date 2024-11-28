import * as THREE from 'three';
import {rgbToHex} from './utils.js'


class MyGraph {

	/**
	   constructs the object
	*/
	constructor(json) {
        this.json = json['yasf']
        this.init()
	}
    init(){
       this.parseGlobals(this.json['globals'])
	   this.parseTextures(this.json['textures'])
    }
	
	parseGlobals(globals){
		this.background = rgbToHex(globals['background'])
		this.ambient = rgbToHex(globals['ambient'])
		this.fogColor =rgbToHex(globals['fog']["color"])
		this.fogNear =(globals['fog']["near"])
		this.fogFar =(globals['fog']["far"])
		this.skybox = globals['skybox']
	}
	parseTextures(textures){
		this.textures = Object.entries(textures).reduce((dict, [name, value]) => {
			dict[name] = value.filepath;
			return dict;
		}, {});
	}

}

export { MyGraph };
