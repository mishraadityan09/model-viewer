"use client"
import React, { useEffect, useRef, useState } from 'react';
import {
    Engine, Scene, Vector3,ArcRotateCamera, FreeCamera, HemisphericLight, GlowLayer, MeshBuilder, StandardMaterial, HDRCubeTexture, CubeTexture, DefaultLoadingScreen, ActionManager, ExecuteCodeAction, PointerEventTypes, SceneLoader, Animation
} from 'babylonjs';
import { AdvancedDynamicTexture } from 'babylonjs-gui';

import 'babylonjs-loaders'
import Dropdown from './dropdown';
import FileUpload from './uploadModel';

function Viewer() {
    const dropdownData = [{id: 0, label: "Sofa"}, {id: 1, label: "Bed"}];
    const canvasRef = useRef(null);
    const [engine, setEngine] = useState(null);
    const [scene, setScene] = useState(null);
    const [camera, setCamera] = useState(null);
    const [pointerStartPosition, setPointerStartPosition] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isProductLoading, setIsProductLoading] = useState(false);
    const [loadingPercentage, setLoadingPercentage] = useState(0);
    const [currentSceneSize, setcurrentSceneSize] = useState(0);
    const [defaultProductModelSize, setDefaultproductmodelsize] = useState(0)
    const [clickableMeshes, setclickablemesh] = useState({
        'chair001': true,
        'diningtable001': true,
        'sofa': true,
        'sofaA': true,
        'sofaWoodA': true,
        'dining table': true,
        'chairA': true,
        'woodA': true,
        'woodB': true,
        'chairB': true,
        'chairC': true,
        'woodC': true,
        'chairD': true,
        'woodD': true,
        'chair002': true,
        'chair003': true,
        'wall2': true,
        'dining chair1': true,
        'dining chair1.001': true,
        'dining chair4': true,
        'dining chair4.001': true,
        'wall': true,
        'scrting': true,
        'lamp015.008': true,
    })

    const meshesOfOtherProducts = {
        'chairA': true,
        'woodA': true,
        'chairB': true,
        'woodB': true,
        'chairC': true,
        'woodC': true,
        'chairD': true,
        'woodD': true,
        'sofaA': true,
        'sofaAWood': true,
    };


    function Loader({ isProductLoading, loadingPercentage }) {
        // console.log("isproductloadin",isProductLoading);
        if (isProductLoading === false) {
            return null; // Render nothing if loading is false
        }

        const progressStyle = {
            backgroundImage: `conic-gradient(#CA9975 ${loadingPercentage * 3.6}deg, #ededed 0deg)`
        };

        return (
            <div className="loader-container">
                <div className="circular-progress" style={progressStyle}>
                    <span className="progress-value">{loadingPercentage.toFixed(0)}%</span>
                </div>
            </div>
        );
    }


    const createScene = () => {
        const engineRef = new Engine(canvasRef.current, true);
        setEngine(engineRef);
        engineRef.snapshotRendering = true;

        window.addEventListener('resize', () => {
            engineRef.resize();
        });

        setIsProductLoading(true);

        const scene = new Scene(engineRef);
      

        scene.gravity = new Vector3(0, -9.81 / 60, 0);
        scene.collisionsEnabled = true;

        let inputMap = {};
        scene.actionManager = new ActionManager(scene);
        scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (evt) => {
            inputMap[evt.sourceEvent.key] = evt.sourceEvent.type === 'keydown';
        }));
        scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (evt) => {
            inputMap[evt.sourceEvent.key] = evt.sourceEvent.type === 'keyup';
        }));

        scene.onPointerObservable.add((event) => {
            if (event.type === PointerEventTypes.POINTERDOWN) {
                // closeDetailsGui();
            }
        });

        scene.onBeforeRenderObservable.add(() => {
            // if (inputMap['ArrowUp'] || inputMap['ArrowDown'] || inputMap['ArrowLeft'] || inputMap['ArrowRight']) {
            //     if (!document.fullscreenElement) {
            //         toggleFullScreen();
            //     }
            // }
        });

        scene.onPointerObservable.add((evt) => {
            if (evt.type === PointerEventTypes.POINTERDOWN) {
                if (currentIndex !== 0) return;
                setPointerStartPosition({ x: evt.event.clientX, y: evt.event.clientY });
            }
        });

        scene.onPointerObservable.add((evt) => {
            if (evt.type === PointerEventTypes.POINTERUP) {
                if (currentIndex !== 0) return;
                if (pointerStartPosition &&
                    (Math.abs(evt.event.clientX - pointerStartPosition.x) > 20 ||
                        Math.abs(evt.event.clientY - pointerStartPosition.y) > 20)) {
                    setCurrentIndex(1);
                }
                setPointerStartPosition(null);
            }
        });

        // Make sure these functions are defined or imported



        const camera = new ArcRotateCamera(
            'camera',          // The name of the camera
            Math.PI / 2,       // Alpha (initial rotation around the Y axis)
            Math.PI / 4,       // Beta (initial rotation around the X axis)
            10,                // Radius (distance from the target)
            new Vector3(1, 1.1, 0),  // Target (where the camera is looking at)
            scene
          );
          
          camera.attachControl(canvasRef.current, true);
          camera.checkCollisions = true;
          camera.applyGravity = true;
          camera.minZ = 0.05;
          camera.wheelDeltaPercentage = 0.01; // Controls zoom speed
          camera.lowerBetaLimit = 0.1; // Set a lower limit to beta to avoid the camera going under the ground
          camera.upperBetaLimit = (Math.PI / 2) * 0.99; // Set an upper limit to beta to avoid the camera flipping over
          camera.lowerRadiusLimit = 2; // Minimum distance from the target
          camera.upperRadiusLimit = 50; // Maximum distance from the target
          setCamera(camera);
          

        const light1 = new HemisphericLight('hemisphericLight', new Vector3(1, 2, 1), scene);
        light1.intensity = 1.7;
        light1.diffuse = new BABYLON.Color4.FromHexString('#fff5b6');

        const glowLayer = new GlowLayer('glow', scene);
        glowLayer.intensity = 0.5;
        glowLayer.customEmissiveColorSelector = (mesh, subMesh, material, result) => {
            if (mesh.highlight) {
                result.set(1, 1, 1, 0.2);
            } else {
                result.set(0, 0, 0, 0);
            }
        };

        const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI('UI', true, scene);
        advancedTexture.useInvalidateRectOptimization = false;

        // Make sure this function is defined or imported
        // loadEnv();

        loadModels(scene, engineRef,camera);

        startRendering(engineRef, scene);

        setScene(scene);
    };


    const loadModels = (scene, engineRef,camera) => {
        SceneLoader.ImportMeshAsync("", "/", "16246.glb", undefined, (event) => {
            if (event.lengthComputable) {
                if (currentSceneSize) {
                    setcurrentSceneSize(event.total)
                }

                const total = event.total + defaultProductModelSize;


                let loaded = event.loaded * 100;


                setLoadingPercentage(loaded / total)
            }
        }).then((loadedScene) => {
            setIsProductLoading(false)
            loadedScene.meshes.forEach((mesh) => {



                //need to disable the effect of hemispheric light on the other part of the scene such that when icreasing
                //the light intensity it does not affect other meshes
                if (mesh.material && mesh.material instanceof BABYLON.PBRMaterial && (!meshesOfOtherProducts[mesh.name])) {
                    // Disable direct light influence (e.g., hemispheric light)
                    mesh.material.directIntensity = 1; // This will ignore hemispheric light but keep environment lighting
                }

                // if (this.meshesForShadow[mesh.name]) {
                //     mesh.receiveShadows = true;
                //     this.shadowGenerator.addShadowCaster(mesh);
                // }
                if (clickableMeshes[mesh.name]) {

                    // mesh.receiveShadows = true;
                    // this.shadowGenerator.addShadowCaster(mesh);
                    // mesh.actionManager = new ActionManager(scene);        // Pointer over event
                    // mesh.actionManager.registerAction(
                    //     new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, (event) => {
                    //         // this.highlightMesh(mesh);
                    //     })
                    // );        // Pointer out event
                    // mesh.actionManager.registerAction(
                    //     new ExecuteCodeAction(ActionManager.OnPointerOutTrigger, (event) => {
                    //         // this.removeHighlight(mesh);
                    //     })
                    // );        // Click event
                    // mesh.actionManager.registerAction(
                    //     new ExecuteCodeAction(ActionManager.OnPickTrigger, (event) => {
                    //         // this.handleClick(mesh, this.camera, this.arcRotateCamera);
                    //         // this.openProductList()
                    //     })
                    // );
                }



                if (mesh.name === 'FLOOR_Material #2147170942_0' || mesh.name === 'FLOOR' || mesh.name === 'Floor' || mesh.name === 'floor1' || mesh.name === 'floor' || mesh.name === 'floor001' || mesh.name === 'rug1' || mesh.name === 'rug' || mesh.name === 'rug2' || mesh.name === "Floor" || mesh.name === 'sofa table_1_Material #2147173586_0' || mesh.name === 'bed_table_1_Material #2147173949_0') {
                    mesh.actionManager = new BABYLON.ActionManager(scene);
                    console.log("mesh", mesh);
                
                    // Pointer over event
                    mesh.actionManager.registerAction(
                        new BABYLON.ExecuteCodeAction(
                            BABYLON.ActionManager.OnPickUpTrigger, 
                            (event) => {
                                console.log("login load model", scene);
                                florClickHandler(mesh, camera, scene, event);
                            }
                        )
                    );
                }
                
                // if (this.styleInfo == 'modern') {
                //     if (mesh?.name === 'Object048_Material #2147175207_0') {
                //         mesh.name = 'wall';
                //         // this.applyColorToMesh(mesh, '#80BCBD')
                //     }
                //     if (mesh?.name === 'Floor'|| mesh?.name==="FLOOR_Material #2147170942_0") {

                //         //change flooring

                //         // flooring1
                //         this.applyMaterialOnLoad(
                //             ['/Materials/Floor2/d.jpg', '/Materials/Floor2/d.jpg', '/Materials/Floor2/m.jpg', '/Materials/Floor2/n.jpg', '/Materials/Floor2/r.jpg'],
                //             mesh
                //         )

                //         //flooring2
                //         //       this.applyMaterialOnLoad(
                //         //     ['/Materials/Floor8/d.jpg', '/Materials/Floor8/d.jpg', '/Materials/Floor8/m.jpg', '/Materials/Floor8/n.jpg', '/Materials/Floor8/r.jpg'],
                //         //     mesh
                //         // )

                //         // flooring3
                //         // this.applyMaterialOnLoad(
                //         //     ['/Materials/Floor2/albedo.jpg',
                //         //      '/Materials/Floor2/d.jpg', '/Materials/Floor2/m.jpg', '/Materials/Floor2/n.jpg', '/Materials/Floor2/r.jpg'],
                //         //     mesh
                //         // )




                //     }
                // }
                // else {
                //     if (mesh?.name === 'Object048_Material #2147175207_0') {
                //         mesh.name = 'wall';
                //         // this.applyColorToMesh(mesh, '#176B87')
                //     }
                //     if (mesh?.name === 'Floor' || mesh?.name==="FLOOR_Material #2147170942_0") {
                //         this.applyMaterialOnLoad(
                //             ['/Materials/Floor2/d.jpg', '/Materials/Floor2/d.jpg', '/Materials/Floor2/m.jpg', '/Materials/Floor2/n.jpg', '/Materials/Floor2/r.jpg'],
                //             mesh
                //         )
                //     }
                // }
            })
        })

    };



    const florClickHandler = (mesh ,camera, scene, event) => {
        console.log("camera",camera);
        //this.currentIndex===1 means first animation already completed
        if (currentIndex === 1) {
            setCurrentIndex(currentIndex + 1)

        }

        
        // Use scene.pick to get the pickInfo if not available directly in the event
        const pickResult = event.pickInfo || scene.pick(scene.pointerX, scene.pointerY);
        // Check if pickInfo is available
        if (pickResult && pickResult.hit) {
            // Get the clicked point in world coordinates
            const pickedPoint = pickResult.pickedPoint;
            console.log("position", pickResult.pickedPoint);
            // Adjust the height to avoid clipping into the floor
            pickedPoint.y = 1.1;
            // Move the camera towards the clicked point
            moveCameraTowardsPoint(pickedPoint, camera, scene);
        }


    };


  


    const moveCameraTowardsPoint = (targetPosition, camera, scene) => {
        if (!camera || !camera.position) {
            console.error("Camera or camera position is not defined");
            return;
        }
    
        // Animate the camera to smoothly move towards the target position
        const animation = new BABYLON.Animation(
            "cameraAnimation",
            "position",
            60,
            BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );
    
        // Define animation keyframes
        const keys = [
            { frame: 0, value: camera.position.clone() },
            { frame: 100, value: targetPosition },
        ];
    
        animation.setKeys(keys);
    
        // Attach the animation to the camera
        camera.animations = [];
        camera.animations.push(animation);
    
        // Run the animation
        scene.beginAnimation(camera, 0, 100, false);
    };

    const startRendering = (engine, scene) => {

        engine.runRenderLoop(() => {
            scene.render();
        });
    }



    useEffect(() => {
        if (!canvasRef.current) return;
        createScene();

        return () => {
            if (engine) {
                engine.dispose();
            }
        };
    }, [canvasRef]);



    const handleProductSelected = (label) => {
       
        console.log("Selected Label:", label);
      };

    return (
        <>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
            {/* <Loader isProductLoading={isProductLoading} loadingPercentage={loadingPercentage} />
            <Dropdown data={dropdownData}  />
            <FileUpload  scene={scene} sendProductSelected={handleProductSelected}/> */}
            

        </>
    );
}

export default Viewer;
