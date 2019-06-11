import { Router, Request, Response, NextFunction } from 'express';
import { getRepository, Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { DataNotFoundError } from '../util/error';
import { authenticateUser, authorizeAdmin } from '../middleware/authorization';

export class UserController {
  private userRepository: Repository<User> = getRepository(User);
  public router: Router = Router()

  constructor() {
    this.init();
  }
  
  public getUsers = async(req: Request, res: Response, next: NextFunction) => {
    const { skip, take } = req.query;
    const users = await this.userRepository.find({
      skip,
      take,
      order: {
        id: 'ASC'
      },
    });
    res.send(users);
  }

  public getUserById = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userRepository.findOne(req.params.id);
      if (!user) {
        return next(new DataNotFoundError('user'))
      }
      res.send(user)
    } catch (e) {
      return next(e)
    }
  }

  public addUser = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const _user = await this.userRepository.create();
      Object.assign(_user, req.body);
      const user = await this.userRepository.save(_user);
      res.send(user);
    } catch (e) {
      return next(e)
    }
  }

  public deleteUser = async(req: Request, res: Response, next: NextFunction) => {
    const user = await this.userRepository.findOne(req.params.id)
    if (!user) {
      return next(new DataNotFoundError('user'))
    } else {
      await this.userRepository.remove(user);
      res.send(user);
    }
  }

  init() {
    this.router.use('/', authenticateUser, authorizeAdmin);
    this.router.get('/', this.getUsers);
    this.router.post('/', this.addUser);
    this.router.get('/:id', this.getUserById);
    this.router.delete('/:id', this.deleteUser);
  }

}

export default UserController;
