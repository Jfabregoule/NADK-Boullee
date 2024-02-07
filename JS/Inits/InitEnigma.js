export async function InitEnigma(enigmaDetectors, enigmaEntities){
    enigmaDetectors = [];
    enigmaEntities = [];
    let detector = (await SDK3DVerse.engineAPI.findEntitiesByNames('wallDetector'));
    enigmaDetectors.push(...detector);
    detector = (await SDK3DVerse.engineAPI.findEntitiesByNames('redDetector'));
    enigmaDetectors.push(...detector);
    detector = (await SDK3DVerse.engineAPI.findEntitiesByNames('purpleDetector'));
    enigmaDetectors.push(...detector);
    detector = (await SDK3DVerse.engineAPI.findEntitiesByNames('lightDetector'));
    enigmaDetectors.push(...detector);

    let item = (await SDK3DVerse.engineAPI.findEntitiesByNames('cubeEntity'));
    enigmaEntities.push(...item);
    item = (await SDK3DVerse.engineAPI.findEntitiesByNames('redCube'));
    enigmaEntities.push(...item);
    item = (await SDK3DVerse.engineAPI.findEntitiesByNames('purpleCube'));
    enigmaEntities.push(...item);
    item = (await SDK3DVerse.engineAPI.findEntitiesByNames('lightCube'));
    enigmaEntities.push(...item);
}