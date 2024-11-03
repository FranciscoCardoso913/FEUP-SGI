import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';

/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface  {

    /**
     * 
     * @param {MyApp} app The application object 
     */
    constructor(app) {
        this.app = app
        this.datgui =  new GUI();
        this.contents = null
    }

    /**
     * Set the contents object
     * @param {MyContents} contents the contents objects 
     */
    setContents(contents) {
        this.contents = contents
    }

    /**
     * Initialize the gui interface
     */
    init() {

        // Activate/Deactivate the scene3D
        this.datgui.add(this.contents, 'scene3DEnabled', false).name("Scene 3D").onChange( () => { this.contents.enableScene3D() } );
        this.datgui.add(this.app, 'activeCameraName', [ 'Perspective', 'Perspective2','Corner1','Corner2', 'Corner3', 'Corner4', 'Chair','Couch', 'Left', 'Top', 'Front', 'Right', 'Bottom' ,,] ).name("active camera");

        // Folder to control Each Light
        const lightsFolder = this.datgui.addFolder('Lights');
        lightsFolder.close();

        // Ceiling Light
        const ceilingLightFolder = lightsFolder.addFolder('Ceiling Light');
        ceilingLightFolder.add(this.contents.ceilingLight, 'intensity', 0, 1000, 100).name("intensity");
        ceilingLightFolder.add(this.contents.ceilingLight, 'visible').name("visible");
        ceilingLightFolder.add(this.contents.ceilingLight, 'castShadow').name("castShadow");
        ceilingLightFolder.add(this.contents.ceilingLight.shadow.mapSize, 'width', [ 512, 1024, 2048, 4096 ]).name("mapSize Width");
        ceilingLightFolder.add(this.contents.ceilingLight.shadow.mapSize, 'height', [ 512, 1024, 2048, 4096 ]).name("mapSize Height");
        ceilingLightFolder.close();

        // Floor Light
        const floorLightFolder = lightsFolder.addFolder('Floor Light');
        floorLightFolder.add(this.contents.floorLight, 'intensity', 0, 1000, 100).name("intensity");
        floorLightFolder.add(this.contents.floorLight, 'visible').name("visible");
        floorLightFolder.add(this.contents.floorLight, 'castShadow').name("castShadow");
        floorLightFolder.add(this.contents.floorLight.shadow.mapSize, 'width', [ 512, 1024, 2048, 4096 ]).name("mapSize Width");
        floorLightFolder.add(this.contents.floorLight.shadow.mapSize, 'height', [ 512, 1024, 2048, 4096 ]).name("mapSize Height");
        floorLightFolder.close();

        // Landscape Light
        const landscapeLightFolder = lightsFolder.addFolder('Landscape Light');
        landscapeLightFolder.add(this.contents.landscapeLight, 'intensity', 0, 1000, 100).name("intensity");
        landscapeLightFolder.add(this.contents.landscapeLight, 'visible').name("visible");
        landscapeLightFolder.add(this.contents.landscapeLight, 'castShadow').name("castShadow");
        landscapeLightFolder.add(this.contents.landscapeLight.shadow.mapSize, 'width', [ 512, 1024, 2048, 4096 ]).name("mapSize Width");
        landscapeLightFolder.add(this.contents.landscapeLight.shadow.mapSize, 'height', [ 512, 1024, 2048, 4096 ]).name("mapSize Height");
        landscapeLightFolder.close();

    }
}

export { MyGuiInterface };