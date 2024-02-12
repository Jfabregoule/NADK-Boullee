export async function WallEnigma(entity, detector, enigmaDetectors, enigmaEntities, wallOne, wallTwo, colors){
    if (enigmaEntities.includes(entity) && enigmaDetectors.includes(detector)){
        if (entity.getName() == 'cubeEntity' && detector.getName() == 'wallDetector'){
            wallOne.setVisibility(false);
            wallOne.detachComponent('physics_material');
        }
        if (entity.getName() == 'redCube' && detector.getName() == 'redDetector'){
            colors.toggleRed();
        }
        if (entity.getName() == 'purpleCube' && detector.getName() == 'purpleDetector'){
            colors.togglePurple();
        }
        if (entity.getName() == 'lightCube' && detector.getName() == 'lightDetector'){
            colors.toggleLight();
        }
        if (colors.allTrue()){
            wallTwo.setVisibility(false);
            wallTwo.detachComponent('physics_material');
        }
    }
}