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
			let texture;
			if(value.isVideo){
		
				const video = document.createElement('video');
				video.src = value.filepath; 
				video.loop = true; 
				video.muted = true; 
				video.play(); 
				texture = new THREE.VideoTexture(video);
		
			}
			else{
				texture = new THREE.TextureLoader().load(value.filepath)
				texture.minFilter = THREE.LinearMipmapLinearFilter; 
				texture.mipmaps = []
				for( let i =0; i<= 7;i++){
					if(value["mipmap"+i.toString()]){
						texture.mipmaps.append(value["mipmap"+i.toString()]);
					}else break;
				}

			}
			dict[name] = texture;
			return dict;
		}, {});
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
