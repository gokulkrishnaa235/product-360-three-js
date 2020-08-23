import React, { Component } from "react";
import jewel from "./JE03296.glb";
import plane from "./plane0.jpg";
import normal from "./normal.jpg";
import diamondTexture from "./dr1.jpg";
import "./App.css";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

class App extends Component {
  componentDidMount() {
    var camera, scene, renderer, controls, light, light0, backMap, ringGroup;
    var normalMap, envMap, envMap0, blurMap, skyMap, diaMap, skyMap0, stoneMap;


    init();
    animate();


   //  const canvas = document.getElementById("root");
    function init() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("container").appendChild(renderer.domElement);
   //  canvas.appendChild(renderer.domElement);
    renderer.setClearColor(0x040a15, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.05,
      1500
    );
    camera.position.set(12, 3, -2);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.maxDistance = 15;
    controls.minDistance = 5;
    controls.maxPolarAngle = Math.PI / 2 - 0.2;

    scene = new THREE.Scene();
    ringGroup = new THREE.Group();
    scene.add(ringGroup);

    var ambient = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambient);

    light = new THREE.DirectionalLight(0xffffff, 1.2);
  
    light.position.set(50, 0, -10); // 5, 10, 2
    scene.add(light);



    loadMap();
    loadRing();
    loadPlane();
    }
    function loadPlane() {
      var planeMap = new THREE.TextureLoader().load(plane);
      planeMap.wrapS = planeMap.wrapT = THREE.RepeatWrapping;
      planeMap.repeat.set( 10, 10 );
      var planeGeo = new THREE.BoxGeometry(30, 0.1, 30);
      var planeMat = new THREE.MeshBasicMaterial({color:0x3A3A3A, map:planeMap});
      var planeMesh = new THREE.Mesh(planeGeo, planeMat);
      planeMesh.position.y = -0.6;
      ringGroup.add(planeMesh);
   }
   
   function degToRad(x){
      return x*(Math.PI/180)
   }

   function loadMap() {
      normalMap = new THREE.TextureLoader().load(normal);
      normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
      // normalMap.repeat.set( 4, 4 );
      var envUrls = [], blurUrls = [], envUrls0 = [], skyUrls = [], diaUrls = [], backUrls = [], skyUrls0 = [], stoneUrls = [];
      ["LF", "FR", "DN","DN", "FR", "LF"].forEach(str => {
         blurUrls.push("../images/simple/XXX_"+str+".jpg");
      });
      ["RT", "LF", "DN", "DN", "FR", "BK" ].forEach(str => { // ["BK", "DN", "FR", "LF", "RT", "UP"]
         envUrls.push("./XXX_"+str+".jpg");
         envUrls0.push("./XXX_"+str+"0.jpg");
        //  backUrls.push("./back_"+str+".jpg");
         skyUrls0.push("./sky1_"+str+".jpg");
      });
     
      ["px", "nx", "py", "ny", "pz", "nz"].forEach(str => {
         skyUrls.push("./sky/"+str+".jpg");
      });
      for (let i = 0; i < 6; i++) {
         diaUrls.push("./back_line2.png");
         stoneUrls.push(diamondTexture);
      }

      skyMap = new THREE.CubeTextureLoader().load( skyUrls );
      envMap = new THREE.CubeTextureLoader().load( envUrls );
      envMap0 = new THREE.CubeTextureLoader().load( envUrls0 );
      blurMap = new THREE.CubeTextureLoader().load( blurUrls );
      diaMap = new THREE.CubeTextureLoader().load( diaUrls );
      backMap = new THREE.CubeTextureLoader().load( blurUrls );
      skyMap0 = new THREE.CubeTextureLoader().load( skyUrls0 );
      stoneMap = new THREE.CubeTextureLoader().load( stoneUrls );
   }

   function loadRing() {
    var loader = new GLTFLoader();
    loader.load( jewel, function ( object ) {
         var vSize = new THREE.Box3().setFromObject(object.scene).getSize();
         var scl = 5/vSize.x;
         object.scene.scale.set(scl, scl, scl);
         console.log(object.scene)
       
         object.scene.children.forEach((item) => {
            if      (item.name == "gold")        item.material = getMat("phong", 0xc6a76a, 1, backMap, 80,0.7);
            else if (item.name == "silver")      item.material = getMat("phong", 0xececec, 1, backMap, 80,1); 
            else if (item.name == "diamond")     item.material = getMat("phong", 0xFFFFFF, 1, stoneMap, 50,1);
            
               var light = new THREE.PointLight( 0xFFFFFF, 1, 1.2 );
               light.position.z = 1;
              
         });
        
         object.scene.rotation.set(0,degToRad(60),0) ;

         object.scene.position.set(0,10.2,0);
         ringGroup.add(object.scene);
         ringGroup.position.y = -5.3;
      }, undefined, undefined );
   }

   function animate() {
      requestAnimationFrame(animate);
      render();
      var camPos = camera.position;

      
      light.position.set(camPos.x, camPos.y, camPos.z);
      
     
      ringGroup.rotation.y += 0.002;
     
   }

   function render() {renderer.render(scene, camera);}

   function getMat(type, color, trans, envMap, shin,ref) {
      var mat;
      if (type =="basic"){
         mat = new THREE.MeshBasicMaterial()
      }else if (type =="phong"){
         mat = new THREE.MeshPhongMaterial()
      }else if (type == "std"){
         mat = new THREE.MeshStandardMaterial()  
      }
      mat.color.setHex(color);
      mat.transparent = (trans < 1)?true:false;
      mat.opacity = trans;
      mat.envMap = envMap;
      mat.shininess = shin;
      mat.refractionRatio = 0.98; 
      mat.reflectivity = ref;
      mat.roughness = 0;
      mat.side = THREE.DoubleSide;
      return mat;
   }

      }
  render() {
    return <React.Fragment />;
  }
}

export default App;
