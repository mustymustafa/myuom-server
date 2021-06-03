import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import Schema from './schema'


const salt = bcrypt.genSaltSync(10);



const seedUser = async () => {
  await Schema.User().create({
    name: 'test user',
    email: 'user@uom.com',
    password: bcrypt.hashSync('musty100', salt),
    isConfirmed: true,

  });
}



export default seedUser;

