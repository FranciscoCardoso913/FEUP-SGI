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
        this.datgui.add(this.app, 'activeCameraName', this.app.camerasNames ).name("active camera");
        this.datgui.add(this.contents, 'isWireframe', false).name("Wirefrane").onChange( () => { this.contents.Wireframe() } );
        this.datgui.add(this.contents, 'lightHelpers', false).name("Light Helpers").onChange( () => { this.contents.showLightHelpers() } );
        this.datgui.add(this.contents, 'activeLight', false).name("Lights").onChange( () => { this.contents.activateLight() } );

    }
}

export { MyGuiInterface };