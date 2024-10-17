import * as THREE from 'three';

export class Table{

    constructor(app, widthx =10 ,widthy=10, tableHeight=0.5, legHeight=8, legRadius=2, topColor='#ce9c69', legColor='#ce9c69') {
        this.app = app;
        this.widthx = widthx;
        this.widthy = widthy;
        this.tableHeight = tableHeight;
        this.legHeight = legHeight;
        this.legRadius = legRadius; 
        this.topColor = topColor;
        this.legColor = legColor;
        this.init()
    }

    init(){
        this.legs()
        this.top()
    }

    legs(){


        let legMaterial = new THREE.MeshPhongMaterial({ color: this.legColor, 
            specular: "#000000", emissive: "#000000", shininess: 90 })

        let leg1 = new THREE.CylinderGeometry( this.legRadius, this.legRadius, this.legHeight );
        let leg2 = new THREE.CylinderGeometry( this.legRadius, this.legRadius, this.legHeight );
        let leg3 = new THREE.CylinderGeometry( this.legRadius, this.legRadius, this.legHeight );
        let leg4 = new THREE.CylinderGeometry( this.legRadius, this.legRadius, this.legHeight );

        this.legMesh1 = new THREE.Mesh( leg1, legMaterial );
        this.legMesh2 = new THREE.Mesh( leg2, legMaterial );
        this.legMesh3 = new THREE.Mesh( leg3, legMaterial );
        this.legMesh4 = new THREE.Mesh( leg4, legMaterial );

        this.legMesh1.position.set(-this.widthx/2.5,-this.legHeight/2,-this.widthy/2.5);
        this.legMesh2.position.set(-this.widthx/2.5,-this.legHeight/2,this.widthy/2.5);
        this.legMesh3.position.set(this.widthx/2.5,-this.legHeight/2,-this.widthy/2.5);
        this.legMesh4.position.set(this.widthx/2.5,-this.legHeight/2,this.widthy/2.5);      

    }

    top(){
        let topMaterial = new THREE.MeshPhongMaterial({ color: this.topColor, 
        specular: "#000000", emissive: "#000000", shininess: 90 })

        let top = new THREE.BoxGeometry( this.widthx, this.tableHeight, this.widthy); 
        this.topMesh = new THREE.Mesh( top, topMaterial );
        this.topMesh.position.y = this.legHeight;

        this.topMesh.add(this.legMesh1);
        this.topMesh.add(this.legMesh2);
        this.topMesh.add(this.legMesh3);
        this.topMesh.add(this.legMesh4);

    }

    enable(){
        this.app.scene.add(this.topMesh);
    }

    disable(){
        this.app.scene.remove(this.topMesh);
    }


    

}