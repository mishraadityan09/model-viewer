import {
    Engine, Scene, Vector3, FreeCamera, HemisphericLight, GlowLayer, MeshBuilder, StandardMaterial, HDRCubeTexture, CubeTexture, DefaultLoadingScreen, ActionManager, ExecuteCodeAction, PointerEventTypes, SceneLoader
} from 'babylonjs';
import { AdvancedDynamicTexture } from 'babylonjs-gui';
import 'babylonjs-loaders'



export function loadModels(scene) {
    SceneLoader.ImportMeshAsync("", "https://d1ifia4ms90juw.cloudfront.net/glb/", "RoomVer10.glb", undefined, (event) => {
        if (event.lengthComputable) {
            console.log("loading");
        }
    })

}


export function startRendering(engine, scene) {

    engine.runRenderLoop(() => {
        scene.render();
    });
}