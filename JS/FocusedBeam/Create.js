export async function createfocusedbeam(player, lightTemplate, focusedBeams){

    const children = await player.getChildren();

    if (children.length > 2)
        SDK3DVerse.engineAPI.deleteEntities([children[2]]);

    let lightParentEntity = player;
    let lightSceneEntity = await lightTemplate.instantiateTransientEntity(
        "Light",
        lightParentEntity,
        true
    );
    focusedBeams.push(lightSceneEntity);
    return true;
}