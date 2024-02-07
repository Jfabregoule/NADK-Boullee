export async function setFPSCameraController(canvas){

	// Remove the required click for the LOOK_LEFT, LOOK_RIGHT, LOOK_UP, and LOOK_DOWN actions.
	SDK3DVerse.actionMap.values["LOOK_LEFT"][0] = ["MOUSE_AXIS_X_POS"];
	SDK3DVerse.actionMap.values["LOOK_RIGHT"][0] = ["MOUSE_AXIS_X_NEG"];
	SDK3DVerse.actionMap.values["LOOK_DOWN"][0] = ["MOUSE_AXIS_Y_NEG"];
	SDK3DVerse.actionMap.values["LOOK_UP"][0] = ["MOUSE_AXIS_Y_POS"];
	SDK3DVerse.actionMap.propagate();

	// Lock the mouse pointer
	canvas.requestPointerLock = (
	  	canvas.requestPointerLock
	  	|| canvas.mozRequestPointerLock
	  	|| canvas.webkitPointerLockElement
	);
	canvas.requestPointerLock();
};