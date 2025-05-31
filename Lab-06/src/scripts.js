    import * as THREE from 'three';
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
    import { GUI } from 'dat.gui';

    // Renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const orbit = new OrbitControls(camera, renderer.domElement);
    camera.position.set(-10, 30, 30);

    // Configure OrbitControls for smoother rotation
    orbit.enableDamping = true; // Enable smooth damping
    orbit.dampingFactor = 0.05; // Adjust damping speed
    orbit.rotateSpeed = 1; // Reduce rotation speed for better control
    orbit.minDistance = 5; // Minimum zoom distance
    orbit.maxDistance = 50; // Maximum zoom distance
    orbit.maxPolarAngle = Math.PI; // Allow full vertical rotation
    orbit.minPolarAngle = -Math.PI; // Allow rotation from below
    orbit.enablePan = true; // Enable panning
    orbit.panSpeed = 1; // Adjust panning speed
    orbit.update();

    // Axes Helper
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // Create a background with student ID text on canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Set background color and text style
    context.fillStyle = '#87CEEB';  // Set background color (light sky blue)
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Create a texture from the canvas
    const texture = new THREE.CanvasTexture(canvas);

    // Add a large plane as background
    const planeGeometry = new THREE.PlaneGeometry(100, 100);
    const planeMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true
    });
    const backgroundPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(backgroundPlane);
    backgroundPlane.position.z = -50;

    // Add Plane (Mặt phẳng dưới)
    const groundPlaneGeometry = new THREE.PlaneGeometry(40, 40);
    const groundPlaneMaterial = new THREE.MeshBasicMaterial({
        color: 0xadbebb,
        side: THREE.DoubleSide
    });
    const groundPlane = new THREE.Mesh(groundPlaneGeometry, groundPlaneMaterial);
    scene.add(groundPlane);
    groundPlane.rotation.x = -0.5 * Math.PI;

    // Add Grid (Lưới)
    const gridHelper = new THREE.GridHelper(40, 20);
    scene.add(gridHelper);

    // Create GUI controls with custom styling
    const gui = new GUI();
    gui.width = 320;
    gui.domElement.style.marginTop = '10px';
    gui.domElement.style.marginRight = '10px';

    // Custom folder styling
    const customFolderStyle = {
        margin: '5px 0',
        padding: '5px',
        backgroundColor: '#2a2a2a',
        borderRadius: '4px'
    };

    // Object selection
    const objectSelector = {
        selectedObject: 'box', // Default: box is selected
        autoRotate: true // Default: auto rotation is on
    };

    // Store all object controls
    const objectControls = {};

    // Create transformation controls for each object
    const createObjectControls = (object, name) => {
        const objectFolder = gui.addFolder(name + ' Transformations');
        objectFolder.domElement.style.cssText = Object.entries(customFolderStyle).map(([key, value]) => `${key}: ${value}`).join(';');
        objectFolder.close();

        // Add a header with object name
        const header = document.createElement('div');
        header.style.cssText = 'color: #fff; font-weight: bold; margin-bottom: 10px; padding: 5px; background: #3a3a3a; border-radius: 3px;';
        header.textContent = name;
        objectFolder.domElement.insertBefore(header, objectFolder.domElement.firstChild);

        // Rotation controls
        const rotationFolder = objectFolder.addFolder('Rotation');
        rotationFolder.domElement.style.cssText = Object.entries(customFolderStyle).map(([key, value]) => `${key}: ${value}`).join(';');
        
        const rotationControls = {
            x: object.rotation.x,
            y: object.rotation.y,
            z: object.rotation.z
        };

        rotationFolder.add(rotationControls, 'x', 0, Math.PI * 2)
            .name('X Rotation')
            .onChange((value) => {
                object.rotation.x = value;
                rotationControls.x = value;
            });
        rotationFolder.add(rotationControls, 'y', 0, Math.PI * 2)
            .name('Y Rotation')
            .onChange((value) => {
                object.rotation.y = value;
                rotationControls.y = value;
            });
        rotationFolder.add(rotationControls, 'z', 0, Math.PI * 2)
            .name('Z Rotation')
            .onChange((value) => {
                object.rotation.z = value;
                rotationControls.z = value;
            });

        // Scale controls
        const scaleFolder = objectFolder.addFolder('Scale');
        scaleFolder.domElement.style.cssText = Object.entries(customFolderStyle).map(([key, value]) => `${key}: ${value}`).join(';');
        
        const scaleControls = {
            x: object.scale.x,
            y: object.scale.y,
            z: object.scale.z
        };

        scaleFolder.add(scaleControls, 'x', 0.1, 2)
            .name('X Scale')
            .onChange((value) => {
                object.scale.x = value;
                scaleControls.x = value;
            });
        scaleFolder.add(scaleControls, 'y', 0.1, 2)
            .name('Y Scale')
            .onChange((value) => {
                object.scale.y = value;
                scaleControls.y = value;
            });
        scaleFolder.add(scaleControls, 'z', 0.1, 2)
            .name('Z Scale')
            .onChange((value) => {
                object.scale.z = value;
                scaleControls.z = value;
            });

        // Position controls
        const positionFolder = objectFolder.addFolder('Position');
        positionFolder.domElement.style.cssText = Object.entries(customFolderStyle).map(([key, value]) => `${key}: ${value}`).join(';');
        
        const positionControls = {
            x: object.position.x,
            y: object.position.y,
            z: object.position.z
        };

        positionFolder.add(positionControls, 'x', -20, 20)
            .name('X Position')
            .onChange((value) => {
                object.position.x = value;
                positionControls.x = value;
            });
        positionFolder.add(positionControls, 'y', -20, 20)
            .name('Y Position')
            .onChange((value) => {
                object.position.y = value;
                positionControls.y = value;
            });
        positionFolder.add(positionControls, 'z', -20, 20)
            .name('Z Position')
            .onChange((value) => {
                object.position.z = value;
                positionControls.z = value;
            });

        // Add color control
        const colorFolder = objectFolder.addFolder('Color');
        colorFolder.domElement.style.cssText = Object.entries(customFolderStyle).map(([key, value]) => `${key}: ${value}`).join(';');
        
        const colorParams = {
            color: object.material.color.getHex()
        };
        colorFolder.addColor(colorParams, 'color')
            .name('Object Color')
            .onChange((value) => {
                object.material.color.setHex(value);
                colorParams.color = value;
            });

        // Store the folder reference
        objectControls[name.toLowerCase()] = objectFolder;
    };

    // Function to create and show an object
    function createAndShowObject(type) {
        // Remove any existing object
        if (window.currentObject) {
            scene.remove(window.currentObject);
        }

        let newObject;
        switch(type) {
            case 'box':
                const boxGeometry = new THREE.BoxGeometry(5, 5, 5);
                const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x800080, wireframe: true });
                newObject = new THREE.Mesh(boxGeometry, boxMaterial);
                break;
            case 'tetrahedron':
                const tetrahedronGeometry = new THREE.TetrahedronGeometry(5, 10);
                const tetrahedronMaterial = new THREE.MeshBasicMaterial({ color: 0xEB4704, wireframe: true });
                newObject = new THREE.Mesh(tetrahedronGeometry, tetrahedronMaterial);
                break;
            case 'torus':
                const torusGeometry = new THREE.TorusGeometry(6, 3, 32, 10);
                const torusMaterial = new THREE.MeshBasicMaterial({ color: 0x60EBEA, wireframe: true });
                newObject = new THREE.Mesh(torusGeometry, torusMaterial);
                break;
            case 'cylinder':
                const cylinderGeometry = new THREE.CylinderGeometry(5, 5, 20, 32);
                const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0xFF6347, wireframe: true });
                newObject = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
                break;
            case 'cone':
                const coneGeometry = new THREE.ConeGeometry(5, 20, 32);
                const coneMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00, wireframe: true });
                newObject = new THREE.Mesh(coneGeometry, coneMaterial);
                break;
        }

        if (newObject) {
            newObject.position.set(0, 8, 0);
            scene.add(newObject);
            window.currentObject = newObject;
            
            // Update transformation folder title and controls
            const objectName = type.charAt(0).toUpperCase() + type.slice(1);
            if (objectControls[type]) {
                // Update folder name
                objectControls[type].name = objectName + ' Transformations';
                
                // Update header text
                const header = objectControls[type].domElement.querySelector('div');
                if (header) {
                    header.textContent = objectName;
                }

                // Update control values
                const folders = objectControls[type].__folders;
                if (folders) {
                    // Update rotation controls
                    if (folders.Rotation) {
                        folders.Rotation.controllers.forEach(controller => {
                            controller.updateDisplay();
                        });
                    }
                    // Update scale controls
                    if (folders.Scale) {
                        folders.Scale.controllers.forEach(controller => {
                            controller.updateDisplay();
                        });
                    }
                    // Update position controls
                    if (folders.Position) {
                        folders.Position.controllers.forEach(controller => {
                            controller.updateDisplay();
                        });
                    }
                    // Update color control
                    if (folders.Color) {
                        folders.Color.controllers.forEach(controller => {
                            controller.updateDisplay();
                        });
                    }
                }
            } else {
                createObjectControls(newObject, objectName);
            }
            updateActiveObjectControls(type);
        }
    }

    // Create a dropdown for object selection
    const selectionFolder = gui.addFolder('Select Object');
    selectionFolder.add(objectSelector, 'selectedObject', ['box', 'tetrahedron', 'torus', 'cylinder', 'cone'])
        .name('Select Object')
        .onChange((value) => {
            createAndShowObject(value);
        });

    // Add auto-rotation toggle
    selectionFolder.add(objectSelector, 'autoRotate')
        .name('Auto Rotate')
        .onChange((value) => {
            // Update rotation state
            window.autoRotate = value;
        });

    // Function to update active object controls
    function updateActiveObjectControls(selectedObject) {
        Object.values(objectControls).forEach(folder => {
            folder.hide();
        });
        if (objectControls[selectedObject]) {
            objectControls[selectedObject].show();
        }
    }

    // Camera controls with improved styling
    const cameraFolder = gui.addFolder('Camera Controls');
    cameraFolder.domElement.style.cssText = Object.entries(customFolderStyle).map(([key, value]) => `${key}: ${value}`).join(';');

    // Camera position controls
    const cameraPositionFolder = cameraFolder.addFolder('Camera Position');
    cameraPositionFolder.domElement.style.cssText = Object.entries(customFolderStyle).map(([key, value]) => `${key}: ${value}`).join(';');

    const cameraPositionControls = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
    };

    cameraPositionFolder.add(cameraPositionControls, 'x', -30, 30)
        .name('X Position')
        .onChange((value) => camera.position.x = value);
    cameraPositionFolder.add(cameraPositionControls, 'y', -30, 30)
        .name('Y Position')
        .onChange((value) => camera.position.y = value);
    cameraPositionFolder.add(cameraPositionControls, 'z', -30, 40)
        .name('Z Position')
        .onChange((value) => camera.position.z = value);

    // Camera lookAt controls
    const lookAtFolder = cameraFolder.addFolder('Look At Point');
    lookAtFolder.domElement.style.cssText = Object.entries(customFolderStyle).map(([key, value]) => `${key}: ${value}`).join(';');

    const lookAtPoint = new THREE.Vector3(0, 0, 0);
    const lookAtControls = {
        x: lookAtPoint.x,
        y: lookAtPoint.y,
        z: lookAtPoint.z
    };

    lookAtFolder.add(lookAtControls, 'x', -20, 20)
        .name('X')
        .onChange((value) => {
            lookAtPoint.x = value;
            orbit.target.set(lookAtPoint.x, lookAtPoint.y, lookAtPoint.z);
            orbit.update();
        });
    lookAtFolder.add(lookAtControls, 'y', -20, 20)
        .name('Y')
        .onChange((value) => {
            lookAtPoint.y = value;
            orbit.target.set(lookAtPoint.x, lookAtPoint.y, lookAtPoint.z);
            orbit.update();
        });
    lookAtFolder.add(lookAtControls, 'z', -20, 20)
        .name('Z')
        .onChange((value) => {
            lookAtPoint.z = value;
            orbit.target.set(lookAtPoint.x, lookAtPoint.y, lookAtPoint.z);
            orbit.update();
        });

    // Reset controls with improved styling
    const resetFolder = gui.addFolder('Reset Controls');
    resetFolder.domElement.style.cssText = Object.entries(customFolderStyle).map(([key, value]) => `${key}: ${value}`).join(';');

    resetFolder.add({
        resetAll: () => {
            // Reset camera
            camera.position.set(-10, 30, 30);
            lookAtPoint.set(0, 0, 0);
            orbit.target.set(0, 0, 0);
            orbit.update();
            
            // Reset current object if exists
            if (window.currentObject) {
                window.currentObject.rotation.set(0, 0, 0);
                window.currentObject.scale.set(1, 1, 1);
                window.currentObject.position.set(0, 8, 0);
            }
            
            // Update GUI
            gui.updateDisplay();
        }
    }, 'resetAll').name('Reset All');

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation loop
    function animate() {
        if (window.currentObject && window.autoRotate) {
            window.currentObject.rotation.x += 0.01;
            window.currentObject.rotation.y += 0.01;
        }
        
        // Update OrbitControls
        orbit.update();
        
        renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(animate);

    // Initialize auto-rotation state
    window.autoRotate = objectSelector.autoRotate;

    // Initialize with box
    createAndShowObject('box');
