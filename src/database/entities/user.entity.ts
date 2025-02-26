import { ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { ProfileEntity } from './profile.entity';
import { BookEntity } from './book.entity';

@ObjectType()
@Entity({
  name: 'users',
})
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @OneToOne(() => ProfileEntity, (profile) => profile.user, {
    eager: true,
    cascade: true,
  })
  profile: ProfileEntity;

  @OneToMany(() => BookEntity, (book) => book.author, {
    cascade: true,
  })
  books: BookEntity[];
}
