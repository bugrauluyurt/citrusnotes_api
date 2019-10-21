//import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, Max, Min } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    public id: number;

    @IsNotEmpty()
    @Min(3)
    @Max(100)
    @Column()
    public firstName: string;

    @IsNotEmpty()
    @Min(3)
    @Max(100)
    @Column()
    public lastName: string;

    @IsNotEmpty()
    @Min(6)
    @Max(10)
    @Exclude()
    @Column()
    public password: string;

    @IsNotEmpty()
    @IsEmail()
    @Column()
    public email: string;

    // public toString(): string {
    //     return `${this.firstName} ${this.lastName} (${this.email})`;
    // }

    // @BeforeInsert()
    // public async hashPassword(): Promise<void> {
    //     this.password = await User.hashPassword(this.password);
    // }

    // public static hashPassword(password: string): Promise<string> {
    //     return new Promise((resolve, reject): string => {
    //         return bcrypt.hash(password, 10, (err, hash) => {
    //             if (err) {
    //                 return reject(err);
    //             }
    //             resolve(hash);
    //         });
    //     });
    // }
    //
    // public static comparePassword(user: User, password: string): Promise<boolean> {
    //     return new Promise((resolve, reject): number => {
    //         return bcrypt.compare(password, user.password, (err, res) => {
    //             resolve(res === true);
    //         });
    //     });
    // }
}
