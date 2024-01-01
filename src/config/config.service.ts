import { DotenvParseOutput, config } from 'dotenv';

export type TConfigService = {
  get(key: string): string;
};

export class ConfigService implements TConfigService {
  private config: DotenvParseOutput;
  constructor() {
    const { error, parsed } = config();
    if (error) {
      throw new Error('.env not found');
    }
    if (!parsed) {
      throw new Error('.env is empty');
    }
    this.config = parsed;
  }

  get(key: string): string {
    const res = this.config[key];
    if (!res) {
      throw new Error('Key doesnt exist');
    }
    return res;
  }
}
