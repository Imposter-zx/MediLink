import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

/**
 * Audit Log Entity
 * Tracks all system activities for compliance and security auditing
 */
@Entity('audit_logs')
@Index('idx_timestamp', ['timestamp'])
@Index('idx_user_id', ['userId'])
@Index('idx_action', ['action'])
@Index('idx_resource', ['resourceType', 'resourceId'])
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column()
  userEmail!: string;

  @Column()
  userRole!: string;

  @CreateDateColumn()
  timestamp!: Date;

  @Column({
    type: 'varchar',
    enum: [
      'LOGIN',
      'LOGOUT',
      'CREATE',
      'READ',
      'UPDATE',
      'DELETE',
      'EXPORT',
      'IMPORT',
      'DECRYPT',
      'ENCRYPT',
      'FAILED_AUTH',
      'UNAUTHORIZED_ACCESS',
      'PERMISSION_DENIED',
      'DATA_BREACH',
      'SYSTEM_ERROR',
    ],
  })
  action!: string;

  @Column()
  resourceType!: string;

  @Column({ nullable: true })
  resourceId!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'json', nullable: true })
  metadata!: Record<string, any>;

  @Column({ nullable: true })
  ipAddress!: string;

  @Column({ nullable: true })
  userAgent!: string;

  @Column({ type: 'varchar', default: 'INFO' })
  severity!: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

  @Column({ default: false })
  compliant!: boolean;

  @Column({ type: 'text', nullable: true })
  notes!: string;
}
