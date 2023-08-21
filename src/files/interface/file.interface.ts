export interface File {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly url: string;
  readonly size: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
