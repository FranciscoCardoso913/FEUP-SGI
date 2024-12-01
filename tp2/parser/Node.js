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
        this.edges = json["children"]["nodesList"] ? json["children"]["nodesList"] : []
        this.transforms = json ["transforms"]? json ["transforms"]:[]
		this.primitives =  Object.entries(json["children"]).reduce((list, [name, value]) => {
			if(name !== "nodesList"){
				list.push (value)
			}
			return list;
		}, []);
	}

	build(nodes, materials, inheritMaterial = null){

		let node = new THREE.Group()
		const materialref = this.json["materialref"]
		let materialId = null;

		if( materialref) materialId = materialref["materialId"];
		const material = materialId ? materials[materialId] : inheritMaterial

		this.edges.forEach(element => {
			let child = nodes[element].build(nodes, materials, material);
			if(child) node.add(child)
		});

		this.primitives.forEach(element => {
			let child = buildPrimitive(element, material)
			if(child) node.add(child)
		});

		node = this.transform(node)
		
		return node
	}

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