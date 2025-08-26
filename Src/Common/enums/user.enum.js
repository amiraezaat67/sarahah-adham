


export const GenderEnum = {
    MALE:"male",
    FEMALE:"female"
}


export const RoleEnum = {
    USER:"user",
    ADMIN:"admin",
    SUPER_ADMIN:"super_admin"
}

export const priviledges ={
    ADMIN:[RoleEnum.ADMIN,RoleEnum.SUPER_ADMIN],
    SUPER_ADMIN:[RoleEnum.SUPER_ADMIN],
    ADMIN:[RoleEnum.ADMIN],
    USER:[RoleEnum.USER],
    ALL:[RoleEnum.ADMIN,RoleEnum.SUPER_ADMIN,RoleEnum.USER]

}

export const skillsLevelEnum = {
    BEGINNER:"beginner",
    INTERMEDIATE:"intermediate",
    ADVANCED:"advanced"
}