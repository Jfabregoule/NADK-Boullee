import { setFPSCameraController } from "../Utilities/LockScreen.js";

export async function InitFirstPersonController(charCtlSceneUUID) {

	// Player Template Initialization
	const playerTemplate = new SDK3DVerse.EntityTemplate();+
	playerTemplate.attachComponent("scene_ref", { value: charCtlSceneUUID });

	// Init at the root of the main scene
	const parentEntity = null;

	// Delete entity when app is closed
	const deleteOnClientDisconnection = true;

	// Initialisation of a transient entity for the player
	const playerSceneEntity = await playerTemplate.instantiateTransientEntity(
		"Player",
		parentEntity,
		deleteOnClientDisconnection
	);

	// Character controller setup
	const firstPersonController = (await playerSceneEntity.getChildren())[0];
	
	// Camera setup
	const children = await firstPersonController.getChildren();
	const firstPersonCamera = children.find((child) =>
		child.isAttached("camera")
	);

	// Assign script to controller
	SDK3DVerse.engineAPI.assignClientToScripts(firstPersonController);

	// Main camera setup
	SDK3DVerse.setMainCamera(firstPersonCamera);

	// Background music setup
	document.addEventListener('mousedown', () => {
		const backgroundMusic = document.getElementById("backgroundMusic");
		backgroundMusic.volume = 0.1;
		backgroundMusic.play();
	});
}