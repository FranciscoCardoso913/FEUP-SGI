import * as THREE from 'three';
import {rgbToHex} from './utils.js'
import {parseAmbientLight,parseFog, parseSkybox,parseTextures,parseMaterials} from './parser.js'


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
	   this.textures= parseTextures(this.json['textures'])
	   this.materials = parseMaterials(this.textures, this.json["materials"])

    }

	parseGlobals(globals){
		this.background = rgbToHex(globals['background'])
		this.ambientLight = parseAmbientLight(globals['ambient'])
		this.fog = parseFog(globals["fog"])
		this.skybox = parseSkybox(globals['skybox'])
	}

	parseMaterials(materials){

	}

	build(scene){
		scene.background = this.background
		scene.fog = this.fog
		scene.add(this.skybox)
		scene.add(this.ambientLight)
	}

}

export { MyGraph };
