"use client";
"use client";
import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import {
    Engine,
    Scene,
    ArcRotateCamera,
    HemisphericLight,
    Vector3,
    FilesInput,
    CubeTexture,
    FramingBehavior,
    MeshBuilder,
    StandardMaterial,
    Texture,
    PBRMaterial
} from "babylonjs";
import "babylonjs-loaders";
import TextureUpload from "./textureUpload";
import FileUpload from "./uploadModel";
import ImageUpload from "./imageInput";
import icon from "../../public/3d-model.png"

function Viewer({ autoRotate, cameraPosition }) {
    const canvasRef = useRef(null);
    const [engine, setEngine] = useState(null);
    const [scene, setScene] = useState(null);
    const [mesh, setMesh] = useState([]);
    const [show, setShow] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const[selectedMeshForTextureChange,setSelectedMeshForTextureChange]=useState(null);
    const [pbrMaterialList, setPbrMaterialList] = useState({});
    const [textureReady, setIstextureready]=useState(false);
    const [modelUploaded, setModelUploaded] = useState(false); // New state


    const prepareLighting = (scene) => {
        const texture = new BABYLON.CubeTexture('/environment3.env', scene);
        const skybox = scene.createDefaultSkybox(texture, true, 10000, 0.5, true);
    };

    const prepareCamera = (scene) => {
        if (!scene.activeCamera) {
            scene.createDefaultCamera(true);

            const camera = scene.activeCamera;
            const _currentPluginName = "gltf";
            if (_currentPluginName === "gltf" || _currentPluginName === "obj") {
                camera.alpha += Math.PI;
            }

            camera.useFramingBehavior = true;
            var framingBehavior = camera.getBehaviorByName("Framing");
            framingBehavior.framingTime = 0;
            framingBehavior.elevationReturnTime = -1;

            camera.lowerRadiusLimit = null;

            var worldExtends = scene.getWorldExtends(function (mesh) {
                return mesh.isVisible && mesh.isEnabled();
            });
            framingBehavior.zoomOnBoundingInfo(worldExtends.min, worldExtends.max);
            if (autoRotate) {
                camera.useAutoRotationBehavior = true;
            }

            if (cameraPosition) {
                camera.setPosition(cameraPosition);
            }

            camera.pinchPrecision = 200 / camera.radius;
            camera.upperRadiusLimit = 5;
            camera.wheelDeltaPercentage = 0.01;
            camera.pinchDeltaPercentage = 0.01;
        }

        scene.activeCamera.attachControl(canvasRef.current, true);
    };

    const logMeshAndMaterialProperties = (scene) => {
        const meshlist = [];
        scene.meshes.forEach((mesh) => {
            // let material = mesh.material;
            // let texture = material.diffuseTexture ? material.diffuseTexture : null;
            if (mesh.name != "__root__" && mesh.name != "hdrSkyBox")
                meshlist.push({
                    name: mesh.name,
                });
        });
        setMesh(meshlist);
    };

    const createScene = () => {
        const scene = new Scene(engine);
        setScene(scene);
    };

    useEffect(() => {
        if (!canvasRef.current) return;
        const engineRef = new Engine(canvasRef.current, true);
        setEngine(engineRef);
        createScene();

        engineRef.runRenderLoop(() => {
            if (scene) {
                scene.render();
            }
        });

        window.addEventListener("resize", () => {
            engineRef.resize();
        });

        const canvas = canvasRef.current;

        const handleDragOver = (event) => {
            event.preventDefault();
        };

        const handleDrop = (event) => {
            event.preventDefault();
            handleFileUpload(event);
        };

        canvas.addEventListener("dragover", handleDragOver);
        canvas.addEventListener("drop", handleDrop);

        return () => {
            if (engineRef) {
                engineRef.dispose();
            }
            canvas.removeEventListener("dragover", handleDragOver);
            canvas.removeEventListener("drop", handleDrop);
        };
    }, [canvasRef]);

    const handleFileUpload = (event) => {
        console.log("Evenet",event);
        setModelUploaded(true);
        const file = event.target.files ? event.target.files[0] : event.dataTransfer.files[0];
        if (file && scene) {
            const fileUrl = URL.createObjectURL(file);
            const filesInput = new FilesInput(engine, scene, (_, newScene) => {
                prepareCamera(newScene);
                prepareLighting(newScene);
                setScene(newScene);
                logMeshAndMaterialProperties(newScene); // Log properties after loading
                let scale = 2;
                newScene.getEngine().setHardwareScalingLevel(1 / scale);
            }, _ => {
                console.log("On progress");
            }, null, null, function () {
                BABYLON.Tools.ClearLogCache();
                console.log("Log cache cleared");
                console.log("Current scene:", scene);
            }, null, (file, scene, message) => {
                console.log(message);
            });

            filesInput.onProcessFileCallback = function (file, name, extension) {
                console.log("done: " + typeof file + " " + name + " " + extension);
                return true;
            };

            filesInput.monitorElementForDragNDrop(canvasRef.current);
            filesInput.loadFiles(event); // Trigger the file loading
        }
    };

    const toggleModal = (e) => {
        setShow(!show);
    };

    const startTextureProcess=(meshname)=>{
        console.log("meshName",meshname);
        setSelectedMeshForTextureChange(meshname)
        setShow(!show);
    }

    const handleImageUpload = (imageUrl, id) => {
        setPbrMaterialList(prevState => ({
            ...prevState,
            [id]: imageUrl
        }));
    };

    useEffect(() => {
        if (Object.keys(pbrMaterialList).length === 4 && selectedMeshForTextureChange) {
            setIstextureready(true);
        }
    }, [pbrMaterialList, selectedMeshForTextureChange]);


    const handleApplyTexture = () => {
        console.log('Apply Texture button clicked!');
        // Add your texture application logic here

        const material = new PBRMaterial("pbr", scene);

        material.albedoTexture = new Texture(pbrMaterialList.bit, scene);
        material.metallicTexture = new Texture(pbrMaterialList.metallic, scene);
        material.bumpTexture = new Texture(pbrMaterialList.normal, scene);
        material.roughnessTexture = new Texture(pbrMaterialList.rough, scene);

        const meshToApply = scene.getMeshByName(selectedMeshForTextureChange);
        if (meshToApply) {
            meshToApply.material = material;
        }

        console.log("PBR Material List is complete:", pbrMaterialList);

        setIstextureready(false);
    };

    const handleBitmap = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            <div className="container">
                <div className="canvasZone">
                    <canvas ref={canvasRef} className="renderCanvas" />
                   {!modelUploaded? <div className="starterdiv"> 
                    <img className="w-1/2 h1/2" src="/3d-model.png" ></img>
                    <p>Upload your Model to view them and change material on them</p>
                    </div>:null}
                    <input className="glb-input" type="file" accept=".glb, .gltf" onChange={handleFileUpload} />
                </div>
                <div className="sidebar">
                    <h2>Meshes</h2>
                    <ul>
                        {mesh.map((mesh, index) => (
                            <li key={index}>
                                <p onClick={() => startTextureProcess(mesh.name)}>{mesh.name}</p>
                            </li>
                        ))}
                    </ul>
                </div>
                <TextureUpload onClose={toggleModal} show={show} title="Dynamic Texture Upload" textureReady={textureReady} onApplyTexture={handleApplyTexture}>
                    <ImageUpload id="bit" pbr="Bit" onImageUpload={handleImageUpload} />
                    <ImageUpload id="metallic" pbr="Metalic" onImageUpload={handleImageUpload} />
                    <ImageUpload id="normal" pbr="Normal" onImageUpload={handleImageUpload} />
                    <ImageUpload id="rough" pbr="Rough" onImageUpload={handleImageUpload} />
                </TextureUpload>
            </div>
        </>
    );
}

export default Viewer;
