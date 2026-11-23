import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('threads')
export class Thread {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    title: string

    @Column()
    author: string

    @Column()
    body: string

    @CreateDateColumn()
    createdAt: Date
}

export type ThreadPayload = Pick<Thread, 'title' | 'author' | 'body'>;
export type ThreadChanges = Partial<Pick<Thread, 'title' | 'body'>>