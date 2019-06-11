import { Router, Request, Response, NextFunction } from 'express';
import { Repository, getRepository } from 'typeorm';
import { User } from '../entity/user.entity';
import { ChangeRole } from '../entity/change-role.entity';
import { ChangePassword } from '../entity/change-password.entity';
import {
  comparePassword,
  hashPassword,
  generateRandomToken,
  signBearerToken
} from '../util/encryption';
import { UnauthorizedError, ErrorMessage, UnprocessableEntityError, DataNotFoundError } from '../util/error';
import { authenticateUser } from '../middleware/authorization';
import { stripPasswordFromEntity } from '../util/utilities';

export class AuthController {
  private userRepository: Repository<User> = getRepository(User);
  private changeRoleRepository: Repository<ChangeRole> = getRepository(ChangeRole);
  private changePasswordRepository: Repository<ChangePassword> = getRepository(ChangePassword);
  public router: Router = Router();

  constructor() {
    this.init();
  }

  private registerUser = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const doesUserExist = await this.userRepository.findOne({ email });
      if (doesUserExist) {
        return next(new UnprocessableEntityError(ErrorMessage.USER_ALREADY_REGISTERED));
      }
      const _user = this.userRepository.create();
      Object.assign(_user, req.body);
      const user = await this.userRepository.save(_user);
      const _changeUserRole = this.changeRoleRepository.create();
      _changeUserRole.setUserRole(user);
      const changeUserRole = await this.changeRoleRepository.save(_changeUserRole);
      res.send({ user: stripPasswordFromEntity(user), token: changeUserRole.token });
    } catch (e) {
      return next(e);
    }
  }

  private verifyUser = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.query;
      const changeUserRole = await this.changeRoleRepository.findOne({
        where: {
          token,
        },
        relations: ['user']
      })
      if (!changeUserRole) {
        return next(new DataNotFoundError('token'));
      }
      const { user, role } = changeUserRole;
      user.role = role;
      await this.userRepository.save(user);
      await this.changeRoleRepository.remove(changeUserRole);
      res.send({ user: stripPasswordFromEntity(user) });
    } catch (e) {
      return next(e)
    }
  }

  private loginUser = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const user = await this.userRepository.findOneOrFail({
        where: {
          email
        },
      })
      if (!user) {
        return next(new DataNotFoundError('user'));
      }
      if (user.isInactiveUser()) {
        return next(new UnauthorizedError(ErrorMessage.UNVERIFIED_USER));
      }
      const passwordVerification = await comparePassword(req.body.password, user.password);
      if (!passwordVerification) {
        return next(new UnauthorizedError(ErrorMessage.PASSWORD_DOES_NOT_MATCH));
      }
      const token = await signBearerToken(user.id);
      res.send({ token, user: stripPasswordFromEntity(user) });
    } catch (e) {
      return next(e)
    }
  }

  private updateEmail = async(req: Request, res: Response, next: NextFunction) => {
    let user = req.user;
    const doesUserExist = await this.userRepository.findOne({ email: req.body.email });
    if (doesUserExist) {
      return next(new UnprocessableEntityError(ErrorMessage.USER_ALREADY_REGISTERED));
    }
    user.email = req.body.email;
    await this.userRepository.save(user);
    res.send({ user });
  }

  private verifyPassword = async(req: Request, res: Response, next: NextFunction) => {
    const user = await this.userRepository.createQueryBuilder('user')
      .where('user.id = :id', { id: req.user.id})
      .addSelect('user.password')
      .getOne();
    const passwordVerification = await comparePassword(req.body.password, user.password);
    if (!passwordVerification) {
      return next(new UnauthorizedError(ErrorMessage.PASSWORD_DOES_NOT_MATCH));
    }
    res.send({ passwordVerification });
  }

  private updatePassword = async(req: Request, res: Response, next: NextFunction) => {
    const user = await this.userRepository.createQueryBuilder('user')
      .where('user.id = :id', { id: req.user.id})
      .addSelect('user.password')
      .getOne();
    const passwordVerification = await comparePassword(req.body.oldPassword, user.password);
    if (!passwordVerification) {
      return next(new UnauthorizedError(ErrorMessage.PASSWORD_DOES_NOT_MATCH));
    }
    const password = await hashPassword(req.body.newPassword);
    user.password = password;
    await this.userRepository.save(user);
    res.send(stripPasswordFromEntity(user));
  }

  private forgotPassword = async(req: Request, res: Response, next: NextFunction) => {
    const user = await this.userRepository.findOne({ email: req.body.email });
    if (!user) {
      return next(new DataNotFoundError(ErrorMessage.USER_DOES_NOT_EXIST));
    }
    const _changePasswordToken = await this.changePasswordRepository.create();
    _changePasswordToken.token = await generateRandomToken();
    _changePasswordToken.user = user;
    const changePasswordToken = await this.changePasswordRepository.save(_changePasswordToken);
    res.send({ changePasswordToken: changePasswordToken.token });
  }

  private resetPassword = async(req: Request, res: Response, next: NextFunction) => {
    const changePasswordToken = await this.changePasswordRepository.findOne({
      token: req.body.resetPasswordToken,
    }, {
      relations: ['user'],
    });
    if (!changePasswordToken) {
      return next(new UnauthorizedError(ErrorMessage.TOKEN_NOT_FOUND));
    }
    if (!changePasswordToken.user) {
      return next(new UnauthorizedError(ErrorMessage.USER_DOES_NOT_EXIST));
    }
    const { user } = changePasswordToken;
    const password = await hashPassword(req.body.password);
    user.password = password;
    await this.userRepository.save(user);
    await this.changePasswordRepository.remove(changePasswordToken);
    const response = {
      user: stripPasswordFromEntity(user)
    }
    res.send(response)
  }

  private init() {
    this.router.post('/register-user', this.registerUser);
    this.router.get('/verify-user', this.verifyUser);
    this.router.post('/login-user', this.loginUser);
    this.router.post('/forgot-password', this.forgotPassword);
    this.router.put('/reset-password', this.resetPassword);
    this.router.put('/update-password', authenticateUser, this.updatePassword);
    this.router.post('/verify-password', authenticateUser, this.verifyPassword);
    this.router.put('/update-email', authenticateUser, this.updateEmail);
  }

}

export default AuthController;