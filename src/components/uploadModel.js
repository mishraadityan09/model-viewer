import React, { useState } from 'react';

const FileUpload = ({scene}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("No file selected");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    } else {
      setSelectedFile(null);
      setFileName("No file selected");
    }
  };

  const handleFileUpload = () => {
    // console.log("scene",scene);
    console.log("selectted product",selectedFile);
  };


  const replaceProductInitialProduct=(currentlySelectedProduct, productObj, scene, urlKey) =>{

    console.log(productObj, " product object");

    console.log(this.productFamily, "this product faimly");
    this.currentlySelectedproductFaimly = this.productFamily;



    let meshPosition;

    if (currentlySelectedProduct.name === "table_kitchen_Material #2147175080_0" || currentlySelectedProduct.name === "table_kitchen") {
        meshPosition = currentlySelectedProduct.parent.getAbsolutePosition().clone();
        currentlySelectedProduct.dispose();
    }
    else if (currentlySelectedProduct.name === "sofaA_primitive0" || currentlySelectedProduct.name === "sofaA") {
        meshPosition = currentlySelectedProduct.getAbsolutePosition().clone();
        currentlySelectedProduct.dispose();
    }
    else if (currentlySelectedProduct.name === 'diningTable_primitive0') {
        meshPosition = currentlySelectedProduct.getAbsolutePosition().clone();
        currentlySelectedProduct.dispose();
    }
    else if (currentlySelectedProduct.name === 'tv_set_2_Material #2147173670_0') {
        meshPosition = currentlySelectedProduct.getAbsolutePosition().clone();
        meshPosition.z -= 0.5;
        currentlySelectedProduct.dispose();

    }
    else {
        // alert("wah")
        //for old model 
        // meshPosition = currentlySelectedProduct.parent.parent.getAbsolutePosition().clone();

        //for new model
        if(this.productFamily === 'Coffee_Table' || this.productFamily ==="Center_Tables"){
            meshPosition = currentlySelectedProduct.parent.parent.getAbsolutePosition().clone();

        }else{
            meshPosition = currentlySelectedProduct.getAbsolutePosition().clone();
        }
      
        currentlySelectedProduct.dispose();
    }

    this.isProductLoading = true;
    BABYLON.SceneLoader.ImportMeshAsync(null, productObj.glbUrl, productObj.name, scene,
        (event) => {
            if (event.lengthComputable) {

                const total = this.currentSceneSize + this.defaultProductModelSize;

                let loaded = (event.loaded + this.currentSceneSize) * 100;

                const percentage = loaded / total;
                this.loadingPercentage = percentage;
            }
        }
    ).then((result) => {
        this.loadingPercentage = 0;
        this.isProductLoading = false;
        const root = result.meshes[0];


        let sv = this.getGUIScrollRect();
        this.advancedTexture.addControl(sv);

        const positionNode = new BABYLON.TransformNode("positionNode");
        sv.linkWithMesh(positionNode);

        var grid = new BABYLON.GUI.Grid();
        grid.background = "black";
        grid.width = "400px";
        sv.addControl(grid);


        let noOfRows = 0;
        grid.addColumnDefinition(0.3);
        grid.addColumnDefinition(0.7);//two coloumns of equal height

        //no. of rows equal to no. of heighlight attribute of 40px height each

        // console.log(grid.height, "grid height");
        //two rectangle for each row 

        this.highlightsData[1] = {
            admin_name: "Price",
            value: '₹' + Math.floor(this.productProps.price)

        }

        this.highlightsData = this.highlightsData.filter(attrObj => attrObj.label !== 'Fabric Material');

        this.highlightsData.forEach(
            (attrObj, index) => {
                // text.text += "\n\n" + attrObj?.admin_name + " : " + attrObj?.value;
                grid.addRowDefinition(40, true);
                noOfRows += 1;
            }
        );

        grid.height = `${noOfRows * 40}px`;

        this.highlightsData.forEach(
            (attrObj, index) => {
                this.createRectForGrid(grid, attrObj, index);
            }
        );

        this.createAnimationForRect(sv);


        // Create a new empty mesh for the parent container
        root.position = meshPosition;
        if (currentlySelectedProduct.name === "table_kitchen_Material #2147175080_0"
            || currentlySelectedProduct.name === "table_kitchen"
            || currentlySelectedProduct.name === 'bed_1_Material #2147168705_0'
            || currentlySelectedProduct.name === "diningTable_primitive0"

        ) {
            root.rotationQuaternion = BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Y, -Math.PI);

            root.position.y = 0;


        }
        else if (currentlySelectedProduct.name === 'tv_set_2_Material #2147173670_0') {
            // Create quaternions for rotations around each axis
            var rotationX = BABYLON.Quaternion.RotationAxis(BABYLON.Axis.X, Math.PI);
            var rotationY = BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Y, Math.PI);
            var rotationZ = BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Z, Math.PI);

            // Combine quaternions to rotate around all axes
            var rotationQuaternion = rotationX.multiply(rotationY).multiply(rotationZ);

            // Apply the rotation quaternion to the object
            root.rotationQuaternion = rotationQuaternion;

            // Reset position if needed
            root.position.y = 0;


        }
        else if (currentlySelectedProduct.name === 'floor_lamp_4_Material #2147173830_0') {
            root.position.y = 0;
            // root.position.z += 0.5;
        }
        else {
            root.rotationQuaternion = BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Y, Math.PI / 2);
            root.position.y = 0;
        }
        //  root.scaling=  new BABYLON.Vector3(0.9,0.9,0.9);
        this.previousMeshPostion = meshPosition;
        this.previousRotation = root.rotationQuaternion;
        //   root.name = meshName;
        // root.rotation = currentlySelectedProduct.rotation;
        //   root.scaling = meshScaling;
        result.meshes.forEach((mesh, i) => {

            if (i) {
                mesh.material.environmentIntensity = 0;

                if (urlKey === 'svara-corner-sofa-in-suede-finish-se15720') {
                    mesh.material.metallic = 0;
                    mesh.material.roughness = 1
                }


                mesh.checkCollisions = true;
                // mesh.receiveShadows = true;
                // this.shadowGenerator.addShadowCaster(mesh);
                this.highlightMesh(mesh);
                this.allChildMeshesOfCurrentlySelectedObject.push(this.initialProductName + " " + mesh.name);
                result.meshes[i].isReplacebel = true;
                result.meshes[i].meshUrlKey = urlKey;
                result.meshes[i].name = this.initialProductName + " " + mesh.name;
                result.meshes[i].productFaimlyName = this.productFamily;

                result.meshes[i].actionManager = new BABYLON.ActionManager(scene);        // Pointer over event
                result.meshes[i].actionManager.registerAction(

                    new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (event) => {
                        // this.handleClick(mesh, this.camera, this.arcRotateCamera,sv,'positionNode');
                        this.openProductList()

                    })
                );
                result.meshes[i].actionManager.registerAction(
                    new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, (event) => {

                        this.highlightMesh(mesh);
                    })
                );        // Pointer out event
                result.meshes[i].actionManager.registerAction(
                    new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, (event) => {
                        this.removeHighlight(mesh);
                        // this.scene.beginAnimation(sv, 10, 0, false);
                    })
                );
            }
        })
        //   this.currentlySelectedMesh = root;

        // const optionsData = {
        //     'parentname':this.initialProductName,
        //     'childMeshes': this.allChildMeshesOfCurrentlySelectedObject,
        //     'parentObject':root,
        // }
        this.options = [
            {
                'parentname': this.productProps.name,
                'childMeshes': this.allChildMeshesOfCurrentlySelectedObject,
                'scrollViewObj': sv,
                'positionNodename': 'positionNode',
                'productFaimlyName': this.productFamily,

                // 'parentObject':root,
            },
            {
                'parentname': 'Sirjla  chair1',
                'childMeshes': ['woodB', 'chairB'],
                'productFaimlyName': 'Single_Seater_Sofa'

            },
            {
                'parentname': 'Sirjla  chair2',
                'childMeshes': ['woodA', 'chairA'],
                'productFaimlyName': 'Single_Seater_Sofa'


            },
            {
                'parentname': 'Nadal  chair 1',
                'childMeshes': ['woodC', 'chairC'],
                'productFaimlyName': 'Single_Seater_Sofa'


            },
            {
                'parentname': 'Nadal  chair 2',
                'childMeshes': ['woodD', 'chairD'],
                'productFaimlyName': 'Single_Seater_Sofa'
            }

        ]

        root.meshUrlKey = urlKey;
        this.animateCameraTo(root, this.camera, this.arcRotateCamera, this.scene, this.canvas)
    });
}

  return (
    <div className="file-upload">
      <input type="file" onChange={handleFileChange} />
      <div className="file-info">
        {fileName}
      </div>
      <button onClick={handleFileUpload}>Upload File</button>
    </div>
  );
};

export default FileUpload;
