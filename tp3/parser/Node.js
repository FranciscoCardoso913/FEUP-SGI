import * as THREE from 'three';
import {rgbToHex, degreesToRadians, parseNodeName} from './utils.js'
import {parseAmbientLight,parseFog, parseSkybox,parseTextures,parseMaterials} from './parser.js'

import { buildPrimitive } from './Primitives.js';


class Node {

	/**
	   constructs the object
	*/
	constructor(json, params) {
		this.params = params
        this.json = json
		this.content = json
		this.load()
	}

	copy(){
		return new Node(JSON.parse(JSON.stringify(this.json)),  JSON.parse(JSON.stringify(this.params)))
	}

	load(){
		this.lightHelpers = false
		this.lodNodes = this.content["lodNodes"]
        this.transforms = this.content ["transforms"]?? []
		this.castshadows = this.content["castshadows"] ?? false
		this.receiveshadows = this.content["receiveshadows"] ?? false
		if(this.content["type"]!=="lod"){
			this.edges = this.content["children"]["nodesList"] ?? []
			this.lods = this.content["children"]["lodsList"] ?? []
			this.primitives =  Object.entries(this.content["children"]).reduce((list, [name, value]) => {
				if(name !== "nodesList" && name !== "lodsList" && name !== "lodNodes"){
					list.push (value)
				}
				return list;
			}, []);
		}
	}

	replaceParams(data, paramNames, paramValues) {
		// Create a map of parameter names to their corresponding values
		const paramMap = {};
		paramNames.forEach((name, index) => {
			paramMap[name] = paramValues[index];
		});
	
		// Recursive function to traverse and replace placeholders
		function replacePlaceholders(value) {
			if (typeof value === 'string') {
				// Replace any parameter names in the string with their corresponding values
				for (const param in paramMap) {
					value = value.split(param).join(paramMap[param]);
				}
			} else if (Array.isArray(value)) {
				// If it's an array, recursively replace items
				value = value.map(item => replacePlaceholders(item));
			} else if (typeof value === 'object' && value !== null) {
				// If it's an object, recursively replace properties
				for (const key in value) {
					value[key] = replacePlaceholders(value[key]);
				}
			}
			return value;
		}
	
		return replacePlaceholders(data);
	}

	setParams(values) {
		if (this.params.length !== values.length) {
			throw new Error("Parameters and values arrays must have the same size.");
		}
	
		this.content = this.replaceParams(this.json, this.params, values)

		if(this.json["f"]) console.log(this.content)

		this.load()
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
				let res = parseNodeName(element.nodeId)
				let nodeId = res.name
				let childNode = nodes[nodeId].copy()
				childNode.setParams(res.params)
				let child = childNode.build(nodes, materials, material);
				if(child) lod.addLevel(child, element.mindist)
			});
			node.add(lod)
		}
		else{

			// Builds all the descendents nodes
			this.edges.forEach(element => {
				console.log(element)
				let res = parseNodeName(element)
				let nodeId = res.name
				let childNode = nodes[nodeId].copy()

				childNode.setParams(res.params)
				let child = childNode.build(nodes, materials, material);
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
				let res = parseNodeName(element)
				let nodeId = res.name
				let childNode = nodes[nodeId].copy()
				childNode.setParams(res.params)
				let child = childNode.build(nodes, materials, material);
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