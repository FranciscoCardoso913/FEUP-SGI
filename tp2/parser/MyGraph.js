import * as THREE from 'three';
import {rgbToHex} from './utils.js'
import {parseAmbientLight,parseFog, parseSkybox} from './parser.js'


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
		this.ambientLight = parseAmbientLight(globals['ambient'])
		this.fog = parseFog(globals["fog"])
		this.skybox = parseSkybox(globals['skybox'])
	}
	parseTextures(textures){
		this.textures = Object.entries(textures).reduce((dict, [name, value]) => {
			dict[name] = value.filepath;
			return dict;
		}, {});
	}
	parseMaterials(materials){

	}

	build(scene){
		scene.fog = this.fog
		scene.add(this.skybox)
		scene.add(this.ambientLight)
	}

}

export { MyGraph };
