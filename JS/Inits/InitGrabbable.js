export async function InitGrabbable(grabbable){
    let cubes = await SDK3DVerse.engineAPI.findEntitiesByNames('cubeEntity');
    grabbable.push(...cubes);
    cubes = await SDK3DVerse.engineAPI.findEntitiesByNames('redCube');
    grabbable.push(...cubes);
    cubes = await SDK3DVerse.engineAPI.findEntitiesByNames('purpleCube');
    grabbable.push(...cubes);
    cubes = await SDK3DVerse.engineAPI.findEntitiesByNames('lightCube');
    grabbable.push(...cubes);
}