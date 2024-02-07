export async function GetTags(tagged, mirrors, buttons, lights, mirrorsShoot, triggerBoxes)
{
    const componentFilter = { mandatoryComponents : ['tags']};
    tagged = await SDK3DVerse.engineAPI.findEntitiesByComponents(componentFilter);
    for (let i = 0; i < tagged.length; i++)
    {
        if (tagged[i].getComponent('tags').value[0] == 'mirror')
        {
            mirrors.push(tagged[i]);
            mirrorsShoot.push(false);
        }
        else if (tagged[i].getComponent('tags').value[0] == 'button')
            buttons.push(tagged[i]);
        else if (tagged[i].getComponent('tags').value[0] == 'light')
        {
            lights.push(tagged[i]);
            triggerBoxes.push(tagged[i]);
        }
    }
}