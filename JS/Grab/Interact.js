export async function Interact(camera, buttons){

    const cameraTransform = camera.getTransform();
    let cubes = await SDK3DVerse.engineAPI.findEntitiesByNames('cubeEntity');

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
    const filterFlags = SDK3DVerse.PhysicsQueryFilterFlag.record_touches;
    // Returns dynamic body (if the ray hit one) in block, and all static bodies encountered along the way in touches
    const{ block, touches } = await SDK3DVerse.engineAPI.physicsRaycast(origin, directionVector, rayLength, filterFlags);
    if (touches.length > 0)
        console.log(touches[0].entity);
    if (touches.length > 0 && buttons.includes(touches[0].entity))
        cubes[0].setGlobalTransform({position : [0, 0, 0]});
}