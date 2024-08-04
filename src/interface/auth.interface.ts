export interface IAuth {
	idx: number;
	jwt: string;
}

export interface IAuthUpdate {
	pwd?: string;
	name?: string;
}
