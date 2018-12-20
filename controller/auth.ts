import * as md5 from 'md5';
import { User } from '~db';
import { createConnection, Connection, Repository } from 'typeorm';

import { IContext } from '~model/context';
import { IUser } from '~model/user';
import { TQueryResult } from '~model/database';
import { IAuthRes, IAuthReqData } from '~model/authData';
import { EStateType } from '~model/message';
import { TFuncVoid, TFunc1 } from '~type';

let connection: Connection;

const connectDB: TFuncVoid<Promise<void>> = async (): Promise<void> => {
    connection = await createConnection({
        type: 'sqlite',
        database: 'database/auth.db',
        entities: [User],
        synchronize: true,
        logging: false
    });
};

connectDB();

export const userList: TFunc1<IContext, Promise<void>> = async (
    ctx: IContext
): Promise<void> => {
    const result: TQueryResult<IUser[]> = await User.find();
    ctx.body = { length: result.length };
};

export const userAuth: TFunc1<IContext, Promise<void>> = async (
    ctx: IContext
): Promise<void> => {
    const { name, persistent }: Pick<IAuthReqData, 'name' | 'persistent'> = <IAuthReqData>ctx.request.body;
    let { password }: Pick<IAuthReqData, 'password'> = <IAuthReqData>ctx.request.body;
    password = persistent ? password : md5(password);
    const result: TQueryResult<IUser> = await User.findOne({ name, password });
    const data: IAuthRes = {
        state: EStateType.Fail,
        data: null ,
        msg: 'login fail'
    };
    if (result) {
        data.state = EStateType.Success;
        data.data = result;
        data.msg = 'login successfully';
    }
    ctx.body = data;
};

export const userCreate: TFunc1<IContext, Promise<void>> = async (
    ctx: IContext
): Promise<void> => {
    const { name }: Pick<IAuthReqData, 'name'> = <IAuthReqData>ctx.request.body;
    let { password }: Pick<IAuthReqData, 'password'> = <IAuthReqData>ctx.request.body;
    let userData: IUser;
    password = md5(password);
    const userRepository: Repository<IUser> = connection.getRepository(User);
    const user: IUser = new User();
    user.name = name;
    user.password = password;
    const data: IAuthRes = {
        state: EStateType.Success,
        msg: 'create a new account successfully',
        data: null
    };
    try {
        userData = await userRepository.save(user);
        data.data = userData;
    } catch (error) {
        data.state = EStateType.Success;
        data.msg = error.message;
    }
    ctx.body = data;
};
