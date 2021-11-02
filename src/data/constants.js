export const DEFAULT_FIELD_CONFIGURATION = {
    tableHeaders:  ['ID','Nombre','Tipo']

}



export const DEFAULT_MESSAGES_USER_ROLE = {
    getSuccessMessage: (reporterName,displayName,projectName,roleName)=> `Hola ${reporterName} \n\nSe agregó al usuario ${displayName} en el proyecto ${projectName} con el rol ${roleName}\n\nSaludos`,
    getErrorMessage: (displayName,projectName,roleName)=> `El usuario ${displayName} ya tiene el rol ${roleName} en el proyecto ${projectName}`,
}