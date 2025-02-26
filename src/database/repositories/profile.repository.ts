import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from '../entities/profile.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProfileRepository extends Repository<ProfileEntity> {
  constructor(
    @InjectRepository(ProfileEntity)
    repository: Repository<ProfileEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
