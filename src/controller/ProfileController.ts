import { ProfileDao } from "../dao/ProfileDao";

export class ProfileController {
    static async getOne(session) {
        const profileData = await ProfileDao.getOne(session.data.userId).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            }
        });

        // build an object with module name and privileges 
        const modulePermission = {};
        
        const convertToFourDigitBinary = (binaryString: string) => {
            if (binaryString == "1") return "1111";
            let newString = binaryString;
            for (let i = binaryString.length; i < 4; i++) {
                newString = "0".concat(newString);
            }
            return newString;
        }
        
        profileData.userRoles.forEach(userRole => {
            userRole.role.privileges.forEach(rp => {
                const moduleName = rp.module.name;
                if (modulePermission[rp.module.name]) {
                    const currentPermission = modulePermission[moduleName];
                    const newPermission = rp.permission;

                    // OR current permission with new one
                    let newPermissionInt = parseInt(currentPermission, 2) | parseInt(newPermission, 2);
                    let newPermissionStr = newPermissionInt.toString(2);
                    
                    modulePermission[rp.module.name] = convertToFourDigitBinary(newPermissionStr);

                } else {
        
                    modulePermission[rp.module.name] = rp.permission;
                }
            });
        });

        // delete user role data
        delete profileData.userRoles;

        // add privileges
        const profile = profileData as any; 
        profile.privileges = modulePermission;

        
        return {
            status: true,
            data: profile
        };
    }
}