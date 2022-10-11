import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entity/User';
import config from './config';

export const initializeDatabase = async (optionOverrides: Record<string, any> = {}): Promise<Connection> => {
    const connectionOptions = config;
    const options: any = {
    ...connectionOptions,
    entities: [User],
    migrations: [__dirname + '/migrations/*.ts'],
    ...optionOverrides
    };
    
    const datasource = new DataSource(options);    

    try {
        await datasource.initialize();
        return datasource
    } catch(err) {
        return
    }
};

export default initializeDatabase;
