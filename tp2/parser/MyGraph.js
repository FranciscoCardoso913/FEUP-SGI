import * as THREE from 'three';
import {rgbToHex} from './utils.js'
import {parseAmbientLight,parseFog, parseSkybox,parseTextures,parseMaterials, parseNodes, parseCameras} from './parser.js'


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
	   this.cameras = parseCameras(this.json["cameras"])
	   this.initCamera = this.json["cameras"]["initial"]

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

	wireframe(bool){
		this.materials = Object.entries(this.materials).reduce((dict, [name, value]) => {
			value.wireframe = bool
			dict[name] = value
			return dict
		},{})
		
	}


	create(scene){
		scene.background = this.background
		scene.fog = this.fog
		scene.add(this.skybox)
		scene.add(this.ambientLight)
		scene.add(this.graph)
	}
	remove (scene){
		scene.remove(this.skybox)
		scene.remove(this.ambientLight)
		scene.remove(this.graph)
	}

}

export { MyGraph };
