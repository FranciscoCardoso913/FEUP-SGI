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
        // add a folder to the gui interface for the box
        const boxFolder = this.datgui.addFolder( 'Box' );
        // note that we are using a property from the contents object 
        boxFolder.add(this.contents, 'boxMeshSize', 0, 10).name("size").onChange( () => { this.contents.rebuildBox() } );
        boxFolder.add(this.contents, 'boxEnabled', false).name("enabled");
        boxFolder.add(this.contents.boxDisplacement, 'x', -5, 5)
        boxFolder.add(this.contents.boxDisplacement, 'y', -5, 5)
        boxFolder.add(this.contents.boxDisplacement, 'z', -5, 5)
        boxFolder.close()
        
        const data = {  
            'diffuse color': this.contents.diffusePlaneColor,
            'specular color': this.contents.specularPlaneColor,
        };

        // adds a folder to the gui interface for the plane
        const planeFolder = this.datgui.addFolder( 'Plane' );
        planeFolder.addColor( data, 'diffuse color' ).onChange( (value) => { this.contents.updateDiffusePlaneColor(value) } );
        planeFolder.addColor( data, 'specular color' ).onChange( (value) => { this.contents.updateSpecularPlaneColor(value) } );
        planeFolder.add(this.contents, 'planeShininess', 0, 1000).name("shininess").onChange( (value) => { this.contents.updatePlaneShininess(value) } );
        planeFolder.add(this.contents, 'planeEnabled', false).name("enabled").onChange( (value) => { this.contents.enablePlane(value) } );
        planeFolder.close();

        // adds a folder to the gui interface for the camera
        const cameraFolder = this.datgui.addFolder('Camera');
        cameraFolder.add(this.app, 'activeCameraName', [ 'Perspective', 'Perspective2','Corner1','Corner2', 'Corner3', 'Corner4', 'Chair','Couch', 'Left', 'Top', 'Front', 'Right', 'Bottom' ,,] ).name("active camera");
        // note that we are using a property from the app 
        cameraFolder.add(this.app.activeCamera.position, 'x', 0, 10).name("x coord")
        cameraFolder.close();

        //  folder for the textures
        const texturesFolder = this.datgui.addFolder('Textures');
        texturesFolder.add(this.contents, 'wrapSName', ['Clamp', 'Repeat', 'Mirror Repeat']).name("Wrapping Mode S").onChange( () => (this.contents.updateWrapMode('s')) )
        texturesFolder.add(this.contents, 'wrapTName', ['Clamp', 'Repeat', 'Mirror Repeat']).name("Wrapping Mode T").onChange( () => (this.contents.updateWrapMode('t')) )
        texturesFolder.add(this.contents, 'repeatU', 0, 10).name("Repeat U").onChange( () => (this.contents.updateRepeat('u', this.contents.repeatU)) )
        texturesFolder.add(this.contents, 'repeatV', 0, 10).name("Repeat V").onChange( () => (this.contents.updateRepeat('v', this.contents.repeatV)) )
        texturesFolder.add(this.contents, 'offsetU', 0, 10).name("Offset U").onChange( () => (this.contents.updateOffset('u', this.contents.offsetU)) )
        texturesFolder.add(this.contents, 'offsetV', 0, 10).name("Offset V").onChange( () => (this.contents.updateOffset('v', this.contents.offsetV)) )
        texturesFolder.add(this.contents, 'rotation', 0, 360).name("Rotation").onChange( () => (this.contents.updateRotation(this.contents.rotation)) )
        texturesFolder.close();

        const scene3DFolder = this.datgui.addFolder('Scene 3D');
        scene3DFolder.add(this.contents, 'scene3DEnabled', false).name("enabled").onChange( () => { this.contents.enableScene3D() } );
    }
}

export { MyGuiInterface };