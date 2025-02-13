export interface IUserSignin {
	readonly token: string;
	readonly pwdUpdatedAt: Date;
}

export interface IUserGet {
	readonly email: string;
	readonly name: string;
	readonly createdAt: Date;
	readonly pwdUpdatedAt: Date;
}

export interface IUserUpdate {
	readonly pwd?: string;
	readonly name?: string;
}
