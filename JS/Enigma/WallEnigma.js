export async function WallEnigma(entity, detector, enigmaDetectors, enigmaEntities, wallOne, wallTwo){
    if (enigmaEntities.includes(entity) && enigmaDetectors.includes(detector)){

        if (entity.getName() == 'cubeEntity' && detector.getName() == 'wallDetector'){
            wallOne.setVisibility(false);
            wallOne.detachComponent('physics_material');
        }
        if (entity.getName() == 'redCube' && detector.getName() == 'redDetector'){
            red = true;
        }
        if (entity.getName() == 'purpleCube' && detector.getName() == 'purpleDetector'){
            purple = true;
        }
        if (entity.getName() == 'lightCube' && detector.getName() == 'lightDetector'){
            light = true;
        }

        if (red && purple && light){
            wallTwo.setVisibility(false);
            wallTwo.detachComponent('physics_material');
        }
    }
}