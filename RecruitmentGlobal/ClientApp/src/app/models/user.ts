export class User {
    id?: number;
    firstName: string;
    middleName: string;
    lastName: string;
    userid: string;
    email: string;
    roleId: number;
    password: string;
    type: string;
    countryName: any;
    countryId: any;
    loginTypes: string;
    active: boolean;
    roleName: any;
    createdBy: any;
    createdDate: any;
    modifiedBy: any;
    modifiedDate: any;
    sessionId: any;
    token: any;
}

export enum LoginTypes
    {
        Global,
        India,
        Admin, 
        New
    }

    export enum Roles
    {
        TeamLeader =  35,
        SuperAdmin = 40,
        Recruiter = 36
    }
