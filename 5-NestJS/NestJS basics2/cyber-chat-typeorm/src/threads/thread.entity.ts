import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, type Relation } from 'typeorm';
import { Comment } from '../comments/comment.entity.js';

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
    
    @OneToMany(()=>Comment, comment=>comment.thread)
    comments:Relation<Comment[]>
}

export type ThreadChanges = Partial<Pick<Thread, 'title' | 'body'>>