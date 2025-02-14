import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ErrorPayload } from '../../common/payload/error.payload';
import { AuthService } from '../auth.service';
import { DAuth } from '../auth.dto';

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

	async validate(req: Request, payload: any): Promise<DAuth> {
		const jwt = req.headers['authorization'];
		const auth: DAuth = await this.authService.validateJwt(payload.sub, jwt);
		if (!auth) {
			throw new ErrorPayload('Unauthorized');
		}

		return auth;
	}
}
