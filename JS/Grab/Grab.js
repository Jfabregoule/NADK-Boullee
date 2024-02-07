export async function Grab(grabbedEntity, isGrabbing, camera, grabbable){
    if (isGrabbing == true)
    {
        grabbedEntity.attachComponent('rigid_body', ({'centerOfMass': [0.5,0.5,0.5]}));
        grabbedEntity = null;
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
            grabbedEntity = (await block.entity);
            grabbedEntity.detachComponent('rigid_body');
            isGrabbing = true;
        }
    }
    return [isGrabbing, grabbedEntity];
}