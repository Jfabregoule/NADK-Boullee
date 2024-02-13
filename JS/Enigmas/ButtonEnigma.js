export async function ButtonEnigma(code, codeTry, camera, lastBtn, codeInteract){
    if (JSON.stringify(code) != JSON.stringify(codeTry)){
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
        const{ block, touches } = await SDK3DVerse.engineAPI.physicsRaycast(origin, directionVector, rayLength, filterFlags);
        if (block != null )
        {
        console.log(block);
            if (block.entity.getComponent('tags')){
                if (block.entity.getComponent('tags').value[0] == 'button'){
                    if (lastBtn != null){
                        let pos = lastBtn.getGlobalTransform().position;
                        lastBtn.setGlobalTransform({position: [pos[0] - 0.05, pos[1], pos[2]]});
                        lastBtn = null;
                    }
                    codeTry.push(block.entity.getComponent('tags').value[1])
                    let pos = block.entity.getGlobalTransform().position;
                    block.entity.setGlobalTransform({position : [pos[0] + 0.05, pos[1], pos[2]]});
                    lastBtn = block.entity;
                }
            }
        }
    }
    if (codeTry.length != 3 && codeTry.length > 0){
        codeInteract.setComponent('material_ref',{value : "2c1b95cd-b15d-4855-8ae3-f4686700b524"});
    }
    if (JSON.stringify(code) == JSON.stringify(codeTry)){
        codeTry = [];
        codeInteract.setComponent('material_ref',{value : "cf7f45ff-014b-4c2c-90fa-1deb01a2a4bb"});
    }
    if (codeTry.length == 3 && JSON.stringify(code) != JSON.stringify(codeTry)){
        codeTry = [];
        codeInteract.setComponent('material_ref',{value : "5629a0e5-e272-4be1-82e1-c8d6cef9ae76"});
    }
    return [codeTry, lastBtn];
}