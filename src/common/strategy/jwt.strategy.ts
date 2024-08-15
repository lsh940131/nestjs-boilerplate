import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ErrorPayload } from '../payload/error.payload';
import { AuthService } from '../../domain/auth/auth.service';
import { IAuth } from '../../domain/auth/auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(
		private configService: ConfigService,
		private authService: AuthService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: configService.get<string>('JWTKEY'),
			ignoreExpiration: false,
			passReqToCallback: true,
		});
	}

	async validate(req: Request, payload: any): Promise<IAuth> {
		const jwt = req.headers['authorization'];
		const auth: IAuth = await this.authService.validateJwt(payload.sub, jwt);
		if (!auth) {
			throw new ErrorPayload({ statusCode: 401, message: 'Unauthorized' });
		}

		return auth;
	}
}
