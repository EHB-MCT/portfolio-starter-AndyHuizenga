/**
 * check modelnane of new phones on post 
 * @param: student name
 * @returns: false if not a match, true if right
 */


function CheckPhoneNames(name){

    console.log(name);
    if(
        name === null 
        || name.length <= 1 
        || typeof(name) !="string" 
        || name.length > 20) {
    return false
}
return true
}

module.exports = {
    CheckPhoneNames
}