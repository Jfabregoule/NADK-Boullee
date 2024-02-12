export async function destroyfocusedbeam(player, focusedBeams) {

    const children = await player.getChildren();

    // Vérifiez que l'élément à l'index 2 existe
    if (children.length > 2) {

        // Utilisez la méthode deleteEntities avec un tableau d'entités

        SDK3DVerse.engineAPI.deleteEntities([children[2]]);
        focusedBeams.shift();
        return false;
    } else {
        console.error("L'élément à l'index 2 n'existe pas dans le tableau.");
    }
}