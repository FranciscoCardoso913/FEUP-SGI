import * as THREE from 'three';
import {rgbToHex, degreesToRadians} from './utils.js'
import {parseAmbientLight,parseFog, parseSkybox,parseTextures,parseMaterials} from './parser.js'

import { buildPrimitive } from './Primitives.js';


class Node {

	/**
	   constructs the object
	*/
	constructor(json) {
        this.json = json
		this.lightHelpers = false
		this.lodNodes = json["lodNodes"]
        this.transforms = json ["transforms"]?? []
		this.castshadows = json["castshadows"] ?? false
		this.receiveshadows = json["receiveshadows"] ?? false
		if(json["type"]!=="lod"){
			this.edges = json["children"]["nodesList"] ?? []
			this.lods = json["children"]["lodsList"] ?? []
			this.primitives =  Object.entries(json["children"]).reduce((list, [name, value]) => {
				if(name !== "nodesList" && name !== "lodsList" && name !== "lodNodes"){
					list.push (value)
				}
				return list;
			}, []);
		}
	}
	/**
	 * Build the node and all its descendents
	 * @param {*} nodes Map with all the nodes
	 * @param {*} materials Map with all the materials
	 * @param {*} inheritMaterial Predecessor material
	 * @returns Mesh with the node and all its descendents
	 */
	build(nodes, materials, inheritMaterial = null){
		let node = new THREE.Group()

		// Checks if has a material of its own or if Predecessor's material must be use
		const materialref = this.json["materialref"]
		let materialId = null;
		if( materialref) materialId = materialref["materialId"];
		const material = materialId ? materials[materialId] : inheritMaterial

		// If node of type lod creates lod with all the lodnodes
		if(this.lodNodes){
			let lod = new THREE.LOD();
			this.lodNodes.forEach(element => {
				let child = nodes[element.nodeId].build(nodes, materials, material);
				if(child) lod.addLevel(child, element.mindist)
			});
			node.add(lod)
		}
		else{

			// Builds all the descendents nodes
			this.edges.forEach(element => {
				let child = nodes[element].build(nodes, materials, material);
				if(child) node.add(child)
				
			});

			// Build all its primitives
			this.primitives.forEach(element => {
				element.lightHelpers = this.lightHelpers
				element.enabled = this.enabled
				let child = buildPrimitive(element, material)
				if(child) node.add(child)
			});

			// Builds all the descendents lodNodes
			this.lods.forEach(element => {
				let child = nodes[element].build(nodes, materials, material);
				if(child) node.add(child)
			});
		}

		//Apply transformations and shadows
		node = this.transform(node)
		node.castShadow = this.castshadows;
		node.receiveShadow = this.receiveshadows;

		node.traverse((child) => {
			if (child.isMesh) {
				child.castShadow = child.castShadow ? child.castShadow : this.castshadows;
				child.receiveShadow = child.receiveShadow ? child.receiveShadow : this.receiveshadows;
			}
		})

		
		return node
	}
	/**
	 * Applies transformations to the node
	 * @param {*} node Node to be used
	 * @returns node after transformations
	 */
	transform(node){
		this.transforms.forEach(element=>{
			if (element["type"]=== "scale"){
				node.scale.copy(new THREE.Vector3(element["amount"]["x"],element["amount"]["y"],element["amount"]["z"]))
			}
			else if (element["type"]=== "translate"){
				node.position.add(new THREE.Vector3(element["amount"]["x"],element["amount"]["y"],element["amount"]["z"]))
			}
			else if(element["type"]=== "rotate"){
				node.rotation.x+= degreesToRadians(element["amount"]["x"])
				node.rotation.y+= degreesToRadians(element["amount"]["y"])
				node.rotation.z+= degreesToRadians(element["amount"]["z"])
			}

		
		})
		return node
	}




}

export { Node };