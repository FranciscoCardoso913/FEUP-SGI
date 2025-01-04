import * as THREE from 'three';
import {rgbToHex} from './utils.js'
import {parseAmbientLight,parseFog, parseSkybox,parseTextures,parseMaterials, parseNodes, parseCameras, parseSkysphere} from './parser.js'


class MyGraph {

	/**
	   constructs the object
	*/
	constructor(json) {
        this.json = json['yasf']
        this.init()
	}
	/**
	 * Parses the json file and creates the graph
	 */
    init(){
       this.parseGlobals(this.json['globals'])
	   this.textures= parseTextures(this.json['textures'])
	   this.materials = parseMaterials(this.textures, this.json["materials"])
	   this.nodes = parseNodes(this.json["graph"])
	   this.rootNode = this.json["graph"]["rootid"]
	   this.cameras = parseCameras(this.json["cameras"])
	   this.initCamera = this.json["cameras"]["initial"]

    }
	/**
	 * Parses the global variables
	 * @param {*} globals json with the global variables
	 */
	parseGlobals(globals){
		this.background = rgbToHex(globals['background'])
		this.ambientLight = parseAmbientLight(globals['ambient'])
		this.fog = parseFog(globals["fog"])
		if(globals['skybox'])
			this.skybox = parseSkybox(globals['skybox'])
		else {
			this.skybox = parseSkysphere(globals['skysphere'])
		}
	}
	/**
	 * Iterates throught the nodes and creates the graph scene
	 */
	build(){
		this.graph = new THREE.Group()
		let root = this.nodes[this.rootNode]
		this.graph.add(root.build(this.nodes, this.materials))
	}

	/**
	 * Enables/Disables the wireframes in all the materials
	 * @param {*} bool True to enable, False to disable
	 */
	wireframe(bool){
		this.materials = Object.entries(this.materials).reduce((dict, [name, value]) => {
			value.wireframe = bool
			dict[name] = value
			return dict
		},{})
		
	}
	/**
	 * Enables/Disables the light helpers in all the light
	 * @param {*} bool True to enable, False to disable
	 */
	lightHelpers(bool){
		this.nodes = Object.entries(this.nodes).reduce((dict, [name, value]) => {
			value.lightHelpers = bool
			dict[name] = value
			return dict
		},{})
		
	}

	lights(bool){
		this.nodes = Object.entries(this.nodes).reduce((dict, [name, value]) => {
			value.enabled = bool
			dict[name] = value
			return dict
		},{})
	}

	/**
	 * Creates the scene with all the yasf information
	 * @param {*} scene 
	 */
	create(scene){
		scene.background = this.background
		scene.fog = this.fog
		scene.add(this.skybox)
		scene.add(this.ambientLight)
		scene.add(this.graph)
	}
	/**
	 * Deletes the scene
	 * @param {*} scene 
	 */
	remove (scene){
		scene.remove(this.skybox)
		scene.remove(this.ambientLight)
		scene.remove(this.graph)
	}

}

export { MyGraph };
