import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async register(
    createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const existingUser = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new ConflictException('Email уже существует');
    }
    let hashedPassword: string | undefined;
    if (createUserDto.password) {
      hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    }
    const user: Partial<User> = {
      email: createUserDto.email,
      username: createUserDto.username,
      password: hashedPassword,
      googleId: createUserDto.googleId,
    };
    const savedUser = await this.userRepository.save(user);
    const { password, ...result } = savedUser;
    void password;
    return result;
  }

  async updateGoogleId(id: string, googleId: string): Promise<void> {
    await this.userRepository.update(id, { googleId });
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.userRepository.findOneBy({ googleId });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  update(id: string, _updateUserDto: UpdateUserDto) {
    void _updateUserDto;
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
