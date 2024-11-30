import * as THREE from 'three';
import {rgbToHex} from './utils.js'
import {parseAmbientLight,parseFog, parseSkybox,parseTextures,parseMaterials, parseNodes} from './parser.js'


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
	   this.nodes = parseNodes(this.json["graph"])
	   this.rootNode = this.json["graph"]["rootid"]

    }

	parseGlobals(globals){
		this.background = rgbToHex(globals['background'])
		this.ambientLight = parseAmbientLight(globals['ambient'])
		this.fog = parseFog(globals["fog"])
		this.skybox = parseSkybox(globals['skybox'])
	}

	build(){
		this.graph = new THREE.Group()
		let root = this.nodes[this.rootNode]
		this.graph.add(root.build(this.nodes, this.materials))
	}


	create(scene){
		scene.background = this.background
		scene.fog = this.fog
		scene.add(this.skybox)
		scene.add(this.ambientLight)
		scene.add(this.graph)
	}

}

export { MyGraph };
