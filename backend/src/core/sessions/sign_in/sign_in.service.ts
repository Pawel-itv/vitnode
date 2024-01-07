import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { SignInCoreSessionsArgs } from './dto/sign_in.args';

import { AccessDeniedError } from '@/utils/errors/AccessDeniedError';
import { Ctx } from '@/types/context.type';
import { CONFIG } from '@/config';
import { convertUnixTime, currentDate } from '@/functions/date';
import { DatabaseService } from '@/database/database.service';
import { core_admin_sessions } from '@/src/admin/core/database/schema/admins';
import { core_sessions } from '@/src/admin/core/database/schema/sessions';

interface CreateSessionArgs extends Ctx {
  email: string;
  name: string;
  userId: string;
  admin?: boolean;
  remember?: boolean;
}

@Injectable()
export class SignInCoreSessionsService {
  constructor(
    private databaseService: DatabaseService,
    private jwtService: JwtService
  ) {}

  protected async createSession({
    admin,
    email,
    name,
    remember,
    req,
    res,
    userId
  }: CreateSessionArgs) {
    if (!CONFIG.cookies.login_token.secret) {
      throw new Error('Login token secret is not defined in .env file');
    }

    const know_device_id: string | undefined = req.cookies[CONFIG.cookies.known_device.name];
    if (!know_device_id) {
      throw new AccessDeniedError();
    }

    const device = await this.databaseService.db.query.core_sessions_known_devices.findFirst({
      where: (table, { eq }) => eq(table.id, know_device_id)
    });

    if (!device) {
      throw new AccessDeniedError();
    }

    const login_token = this.jwtService.sign(
      {
        name,
        email
      },
      {
        secret: CONFIG.cookies.login_token.secret,
        expiresIn: CONFIG.cookies.login_token.expiresIn
      }
    );

    const expires = remember
      ? CONFIG.cookies.login_token.expiresInRemember
      : CONFIG.cookies.login_token.expiresIn;

    if (admin) {
      await this.databaseService.db.insert(core_admin_sessions).values({
        login_token,
        user_id: userId,
        last_seen: currentDate(),
        expires: currentDate() + CONFIG.cookies.login_token.admin.expiresIn
      });

      // Set cookie for session
      res.cookie(CONFIG.cookies.login_token.admin.name, login_token, {
        httpOnly: true,
        secure: true,
        domain: CONFIG.cookie.domain,
        path: '/',
        expires: new Date(
          convertUnixTime(currentDate() + CONFIG.cookies.login_token.admin.expiresIn)
        ),
        sameSite: 'none'
      });

      return login_token;
    }

    await this.databaseService.db.insert(core_sessions).values({
      login_token,
      user_id: userId,
      last_seen: currentDate(),
      expires: currentDate() + expires
    });

    // Set cookie for session
    res.cookie(CONFIG.cookies.login_token.name, login_token, {
      httpOnly: true,
      secure: true,
      domain: CONFIG.cookie.domain,
      path: '/',
      expires: remember
        ? new Date(convertUnixTime(currentDate() + CONFIG.cookies.login_token.expiresIn))
        : null,
      sameSite: 'none'
    });

    return login_token;
  }

  async signIn({ admin, email: emailRaw, password, remember }: SignInCoreSessionsArgs, ctx: Ctx) {
    const email = emailRaw.toLowerCase();
    const user = await this.databaseService.db.query.core_users.findFirst({
      where: (table, { eq }) => eq(table.email, email)
    });
    if (!user) throw new AccessDeniedError();

    const validPassword = await compare(password, user.password);
    if (!validPassword) throw new AccessDeniedError();

    // If admin mode is enabled, check if user has access to admin cp
    if (admin) {
      const accessToAdminCP = await this.databaseService.db.query.core_admin_permissions.findFirst({
        where: (table, { eq, or }) =>
          or(eq(table.group_id, user.group_id), eq(table.user_id, user.id))
      });
      if (!accessToAdminCP) throw new AccessDeniedError();
    }

    return await this.createSession({
      name: user.name,
      email: user.email,
      userId: user.id,
      admin,
      ...ctx,
      remember
    });
  }
}
