/*
//-------------------------------------------------------------------------------------------------------------------------------------------------------
|																																						|
|																																						|
|							---------------------------------------------------------------------------------------------								|
|							|																							|								|
|							|											Setup											|								|
|							|																							|								|
|							---------------------------------------------------------------------------------------------								|
|																																						|
|																																						|
//-------------------------------------------------------------------------------------------------------------------------------------------------------
*/

/*
---------------------------------------------------------------------------------------------
|																							|
|										Imports												|
|																							|
---------------------------------------------------------------------------------------------
*/

import {
	publicToken,
	mainSceneUUID,
	characterControllerSceneUUID,
	objectMeshUUID,
	mirrorSceneUUID,
	phantomMeshUUID,
} from "./config.js";

/*
---------------------------------------------------------------------------------------------
|																							|
|										Init App											|
|																							|
---------------------------------------------------------------------------------------------
*/

window.addEventListener("load", InitApp);

//------------------------------------------------------------------------------

async function InitApp() {
	await SDK3DVerse.startSession({
		userToken: publicToken,
		sceneUUID: mainSceneUUID,
		canvas: document.getElementById("display-canvas"),
		connectToEditor: true,
		startSimulation: "on-assets-loaded",

	});
	await SDK3DVerse.engineAPI.startSimulation();
	await InitFirstPersonController(characterControllerSceneUUID);
	//await InitObject(objectMeshUUID);
	//await InitMirror(mirrorSceneUUID);
	//await InitEnemy(phantomMeshUUID);

	// init console log for C++
	const engineOutputEventUUID = "9d62edc3-d096-40fd-ba7d-60550c050cf1";
	SDK3DVerse.engineAPI.registerToEvent(engineOutputEventUUID, "log", (event) => console.log(event.dataObject.output));

	await Game();
}

/*
---------------------------------------------------------------------------------------------
|																							|
|									Init Character											|
|																							|
---------------------------------------------------------------------------------------------
*/

async function setFPSCameraController(canvas){
	// Remove the required click for the LOOK_LEFT, LOOK_RIGHT, LOOK_UP, and
	// LOOK_DOWN actions.
	SDK3DVerse.actionMap.values["LOOK_LEFT"][0] = ["MOUSE_AXIS_X_POS"];
	SDK3DVerse.actionMap.values["LOOK_RIGHT"][0] = ["MOUSE_AXIS_X_NEG"];
	SDK3DVerse.actionMap.values["LOOK_DOWN"][0] = ["MOUSE_AXIS_Y_NEG"];
	SDK3DVerse.actionMap.values["LOOK_UP"][0] = ["MOUSE_AXIS_Y_POS"];
	SDK3DVerse.actionMap.propagate();

	// Lock the mouse pointer.
	canvas.requestPointerLock = (
	  canvas.requestPointerLock
	  || canvas.mozRequestPointerLock
	  || canvas.webkitPointerLockElement
	);
	canvas.requestPointerLock();
};

//------------------------------------------------------------------------------
async function InitFirstPersonController(charCtlSceneUUID) {
	// To spawn an entity we need to create an EntityTempllate and specify the
	// components we want to attach to it. In this case we only want a scene_ref
	// that points to the character controller scene.
	const playerTemplate = new SDK3DVerse.EntityTemplate();+
	playerTemplate.attachComponent("scene_ref", { value: charCtlSceneUUID });

	// Passing null as parent entity will instantiate our new entity at the root
	// of the main scene.
	const parentEntity = null;
	// Setting this option to true will ensure that our entity will be destroyed
	// when the client is disconnected from the session, making sure we don't
	// leave our 'dead' player body behind.
	const deleteOnClientDisconnection = true;
	// We don't want the player to be saved forever in the scene, so we
	// instantiate a transient entity.
	// Note that an entity template can be instantiated multiple times.
	// Each instantiation results in a new entity.
	const playerSceneEntity = await playerTemplate.instantiateTransientEntity(
		"Player",
		parentEntity,
		deleteOnClientDisconnection
	);

	// The character controller scene is setup as having a single entity at its
	// root which is the first person controller itself.
	const firstPersonController = (await playerSceneEntity.getChildren())[0];
	// Look for the first person camera in the children of the controller.
	const children = await firstPersonController.getChildren();
	const firstPersonCamera = children.find((child) =>
		child.isAttached("camera")
	);

	// We need to assign the current client to the first person controller
	// script which is attached to the firstPersonController entity.
	// This allows the script to know which client inputs it should read.
	SDK3DVerse.engineAPI.assignClientToScripts(firstPersonController);

	// Finally set the first person camera as the main camera.
	SDK3DVerse.setMainCamera(firstPersonCamera);

	document.addEventListener('mousedown', (event) => {
	setFPSCameraController(document.getElementById("display-canvas"));
	// Démarrer la musique
	const backgroundMusic = document.getElementById("backgroundMusic");
	backgroundMusic.volume = 0.1;
	backgroundMusic.play();
});
}

/*
---------------------------------------------------------------------------------------------
|																							|
|										Init Object											|
|																							|
---------------------------------------------------------------------------------------------
*/

async function InitObject(object){

	const objectTemplate = new SDK3DVerse.EntityTemplate();
	objectTemplate.attachComponent('mesh_ref', { value : object });
	objectTemplate.attachComponent('material_ref', { value : "cf7f45ff-014b-4c2c-90fa-1deb01a2a4bb" });

	objectTemplate.attachComponent('physics_material');
	objectTemplate.attachComponent('rigid_body',{mass : 1,centerOfMass :[0.5,0.5,0.5]});
	objectTemplate.attachComponent('box_geometry',{dimension:[1,1,1],offset:[0.5,0.5,0.5]});

	const parentEntity = null;
	const deleteOnClientDisconnection = true;

	const objectEntity = await objectTemplate.instantiateTransientEntity(
		"object",
		parentEntity,
		deleteOnClientDisconnection
	);
	//SDK3DVerse.engineAPI.assignClientToScripts(objectEntity);
}

/*
//-------------------------------------------------------------------------------------------------------------------------------------------------------
|																																						|
|																																						|
|							---------------------------------------------------------------------------------------------								|
|							|																							|								|
|							|										Functions											|								|
|							|																							|								|
|							---------------------------------------------------------------------------------------------								|
|																																						|
|																																						|
//-------------------------------------------------------------------------------------------------------------------------------------------------------
*/

async function Game(){

/*
---------------------------------------------------------------------------------------------
|																							|
|											Inits											|
|																							|
---------------------------------------------------------------------------------------------
*/

	let hasSeenCinematic = false;
	let isShooting;
	const actionQueue = [];

	const persos = await SDK3DVerse.engineAPI.findEntitiesByNames('Player');
	const perso = persos[0];
	let players = await SDK3DVerse.engineAPI.findEntitiesByNames('First Person Controller');
	let player = players[0];
	const camera = SDK3DVerse.engineAPI.cameraAPI.getActiveViewports()[0];

	const lightTemplate = new SDK3DVerse.EntityTemplate();
	lightTemplate.attachComponent("scene_ref", { value: '5cbfd358-45d9-4442-b4bf-dd1b4db5776f' });
	lightTemplate.attachComponent('local_transform', { position : [0, 0, 0] });

	const lights = await SDK3DVerse.engineAPI.findEntitiesByEUID('558bc544-e587-4582-8835-738687d960b2');

	isShooting = false;

	let tmp = await SDK3DVerse.engineAPI.findEntitiesByNames('Cinematic trigger');
	let FirstCinematicTrigger = tmp[0];

	let cubeBox = await SDK3DVerse.engineAPI.findEntitiesByNames('Cube box');

	let triggerBoxes = await SDK3DVerse.engineAPI.findEntitiesByNames('Battle_light');
	triggerBoxes.push(...tmp);
	triggerBoxes.push(...cubeBox);

	let isGrabbing = false;
	let grabbedEntity;
	let grabbable = [];

/*
---------------------------------------------------------------------------------------------
|																							|
|										Collisions											|
|																							|
---------------------------------------------------------------------------------------------
*/

	async function	checkColls(){

			SDK3DVerse.engineAPI.onEnterTrigger((entering, zone) =>
			{
				if (entering == player && zone == lights[0])
					actionQueue.push(() => createfocusedbeam());
				else if (entering == player && zone == FirstCinematicTrigger && !hasSeenCinematic)
				{
					console.log("Cinematic");
					PlayCinematic();
					hasSeenCinematic = true;
				}
			});
			SDK3DVerse.engineAPI.onExitTrigger((exiting, zone) =>
			{
				if (grabbable.includes(exiting) && cubeBox.includes(zone))
				{
					console.log("TEST");
					exiting.setGlobalTransform({position : [0, 0, 0]});
				}
				if (exiting == player && zone == lights[0])
					actionQueue.push(() => destroyfocusedbeam());
			});
	}
	await checkColls();

/*
---------------------------------------------------------------------------------------------
|																							|
|										Beam												|
|																							|
---------------------------------------------------------------------------------------------
*/

	window.requestAnimationFrame(actionQueueLoop);
	async function actionQueueLoop() {
	if(!actionQueue.length) {
		window.requestAnimationFrame(actionQueueLoop);
		return;
	}

	const action = actionQueue.shift();
	await action();
	window.requestAnimationFrame(actionQueueLoop);
	}

	async function	createfocusedbeam(){

		const children = await perso.getChildren();

		if (children.length > 2)
			SDK3DVerse.engineAPI.deleteEntities([children[2]]);

		let lightParentEntity = perso;
		let lightSceneEntity = await lightTemplate.instantiateTransientEntity(
			"Light",
			lightParentEntity,
			true
		);
		isShooting = true;
	}

	async function destroyfocusedbeam() {

		const children = await perso.getChildren();

		// Vérifiez que l'élément à l'index 2 existe
		if (children.length > 2) {

			// Utilisez la méthode deleteEntities avec un tableau d'entités

			SDK3DVerse.engineAPI.deleteEntities([children[2]]);
			isShooting = false;

		} else {
			console.error("L'élément à l'index 2 n'existe pas dans le tableau.");
		}
	}

	async function movefocusedbeam() {

		const children = await perso.getChildren();

		if (isShooting === true && children[2]) {

			const cameraTransform = camera.getTransform();

			// dirVect
			let directionVector = [
				SDK3DVerse.engineAPI.cameraAPI.getActiveViewports()[0].getWorldMatrix()[8],   // X
				SDK3DVerse.engineAPI.cameraAPI.getActiveViewports()[0].getWorldMatrix()[9],   // Y
				SDK3DVerse.engineAPI.cameraAPI.getActiveViewports()[0].getWorldMatrix()[10]   // Z
			];

			// Normalise le vecteur si nécessaire
			const magnitude = Math.sqrt(
				directionVector[0] ** 2 + directionVector[1] ** 2 + directionVector[2] ** 2
			);
			directionVector = [
				-directionVector[0] / magnitude,
				-directionVector[1] / magnitude,
				-directionVector[2] / magnitude
			];

			const origin = [
			cameraTransform.position[0] + directionVector[0], // Multiplie par la distance souhaitée
			cameraTransform.position[1] - 0.5,
			cameraTransform.position[2] + directionVector[2]
			];

			const rayLength = 100;
			const filterFlags = SDK3DVerse.PhysicsQueryFilterFlag.record_touches;
			// Returns dynamic body (if the ray hit one) in block, and all static bodies encountered along the way in touches

			const{ block, touches } = await SDK3DVerse.engineAPI.physicsRaycast(origin, directionVector, rayLength, filterFlags)

			// Vérifiez si la position Y de l'entité a changé
			const epsilon = 0.0001; // Tolerance
			if (Math.abs(children[2].getGlobalTransform().position[1] - cameraTransform.position[1]) > epsilon) {
			cameraTransform.position[1] -= 1;
			}
			// Calcule de la taille du rayon
			let FinalTransform = cameraTransform;
			// Vérifie s'il y a des touches
			while(touches && touches.length > 0 && (triggerBoxes.includes(touches[0].entity) || players.includes(touches[0].entity)))
				touches.shift();

			if (touches && touches.length > 0 && touches[0] && touches[0].position) {
				let distance = Math.sqrt(
					Math.pow(cameraTransform.position[0] - touches[0].position[0], 2) +
					Math.pow(cameraTransform.position[1] - touches[0].position[1], 2) +
					Math.pow(cameraTransform.position[2] - touches[0].position[2], 2)
				);
				FinalTransform.scale = [1, 1, distance];
			} else {
				// touches est undefined ou touches[0].position est undefined
				FinalTransform.scale = [1, 1, 100]; // ou une autre valeur par défaut
			}
				// Mettez à jour la transformée de l'entité
			children[2].setGlobalTransform(FinalTransform);
		}
	}

/*
---------------------------------------------------------------------------------------------
|																							|
|										Grab												|
|																							|
---------------------------------------------------------------------------------------------
*/

	document.addEventListener('keyup',(event)=>{
		if(event.key == 'f'){
			Grab();
		}
	})

	async function InitGrabbable(){
		let cubes = await SDK3DVerse.engineAPI.findEntitiesByNames('cubeEntity');
		grabbable.push(...cubes);
	}

	InitGrabbable();

	async function Grab(){
		if (isGrabbing == true)
		{
			grabbedEntity.attachComponent('rigid_body', ({'centerOfMass': [0.5,0.5,0.5]}));
			//triggerEntity.attachComponent('rigid_body', ({'centerOfMass': [0.5,0.5,0.5]}));
			//triggerEntity.setComponent('physics_material', ({'isTrigger': false}));
			grabbedEntity = null;
			//triggerEntity = null;
			isGrabbing = false;
		}
		else if (isGrabbing == false)
		{

			const cameraTransform = camera.getTransform();

			// dirVect
			let directionVector = [
				SDK3DVerse.engineAPI.cameraAPI.getActiveViewports()[0].getWorldMatrix()[8],   // X
				SDK3DVerse.engineAPI.cameraAPI.getActiveViewports()[0].getWorldMatrix()[9],   // Y
				SDK3DVerse.engineAPI.cameraAPI.getActiveViewports()[0].getWorldMatrix()[10]   // Z
			];

			// Normalise le vecteur si nécessaire
			const magnitude = Math.sqrt(
				directionVector[0] ** 2 + directionVector[1] ** 2 + directionVector[2] ** 2
			);
			directionVector = [
				-directionVector[0] / magnitude,
				-directionVector[1] / magnitude,
				-directionVector[2] / magnitude
			];

			const origin = [
			cameraTransform.position[0] + directionVector[0], // Multiplie par la distance souhaitée
			cameraTransform.position[1] + directionVector[1],
			cameraTransform.position[2] + directionVector[2]
			];

			const rayLength = 1;
			const filterFlags = SDK3DVerse.PhysicsQueryFilterFlag.dynamic_block | SDK3DVerse.PhysicsQueryFilterFlag.record_touches;
			// Returns dynamic body (if the ray hit one) in block, and all static bodies encountered along the way in touches
			const{ block, touches } = await SDK3DVerse.engineAPI.physicsRaycast(origin, directionVector, rayLength, filterFlags);
			if (block != null && grabbable.includes(block.entity))
			{
				if (await block.entity.getName() == "cubeEntity")
				{
					grabbedEntity = (await block.entity);
					//triggerEntity = (await block);
					grabbedEntity.detachComponent('rigid_body');
					isGrabbing = true;
				}
			}
		}
	}

	async function moveGrabbed(){
		const cameraTransform = camera.getTransform();

			// dirVect
			let directionVector = [
				SDK3DVerse.engineAPI.cameraAPI.getActiveViewports()[0].getWorldMatrix()[8],   // X
				SDK3DVerse.engineAPI.cameraAPI.getActiveViewports()[0].getWorldMatrix()[9],   // Y
				SDK3DVerse.engineAPI.cameraAPI.getActiveViewports()[0].getWorldMatrix()[10]   // Z
			];

			// Normalise le vecteur si nécessaire
			const magnitude = Math.sqrt(
				directionVector[0] ** 2 + directionVector[1] ** 2 + directionVector[2] ** 2
			);
			directionVector = [
				-directionVector[0] / magnitude,
				-directionVector[1] / magnitude,
				-directionVector[2] / magnitude
			];

			const pos = [
				(cameraTransform.position[0] + directionVector[0] * 2) -0.5, // Multiplie par la distance souhaitée
				cameraTransform.position[1] + directionVector[1] * 2 - 0.5,
				(cameraTransform.position[2] + directionVector[2] * 2)- 0.5
			];

			grabbedEntity.setGlobalTransform({position : pos});
	}

/*
---------------------------------------------------------------------------------------------
|																							|
|									Cinematic												|
|																							|
---------------------------------------------------------------------------------------------
*/

	async function PlayCinematic(){
		//let transform = camera.getTransform();
		//await SDK3DVerse.engineAPI.cameraAPI.travel(camera, [-3.007635, 5.210598, 68.501045], camera.getTransform().orientation, 1, camera.getTransform().position, camera.getTransform().orientation);
		//camera.setTransform(transform);
	}

/*
//-------------------------------------------------------------------------------------------------------------------------------------------------------
|																																						|
|																																						|
|							---------------------------------------------------------------------------------------------								|
|							|																							|								|
|							|										Game Loop											|								|
|							|																							|								|
|							---------------------------------------------------------------------------------------------								|
|																																						|
|																																						|
//-------------------------------------------------------------------------------------------------------------------------------------------------------
*/

	function loop() {
		movefocusedbeam();
		if (isGrabbing)
			moveGrabbed();
		window.requestAnimationFrame(loop);
	}
	window.requestAnimationFrame(loop);
}
