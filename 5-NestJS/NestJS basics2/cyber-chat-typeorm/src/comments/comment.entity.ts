import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, type Relation } from 'typeorm';
import { Thread } from '../threads/thread.entity.js';

@Entity('comments')
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    threadId: string;

    @Column()
    author: string;

    @Column()
    body: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Thread, thread => thread.comments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'threadId' })
    thread: Relation<Thread>;
}


export type CommentPayload = Pick<Comment, 'author' | 'body'>;
