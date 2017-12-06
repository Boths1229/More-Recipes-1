import Sequelize from 'sequelize';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Users } from '../models';

require('dotenv').config();
/**
 * @class account
 */
export default class account {
  /**
   * Create a new User
   * @param {object} req
   * @param {object} res
   * @returns  {JSON} Returns success or failure message
   */
  static createUser(req, res) {
    const { username, email, confirmPassword } = req.body;
    let { password } = req.body;
    if (username.length < 6) {
      return res.status(400).send({
        error: 'Username must be greater than 5'
      });
    }
    if (confirmPassword !== password) {
      return res.status(400).send({
        error: 'Password does not match'
      });
    }
    if (password) {
      password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    }
    Users
      .create({
        username,
        email,
        password,
      })
      .then((user) => {
        res.status(201).send({
          success: true,
          message: 'Account created',
          username: user.username,
          id: user.id
        });
      })
      .catch((err) => {
        if (err.name === 'SequelizeUniqueConstraintError' || 'SequelizeValidationError') {
          return res.status(400).send({
            error: err.errors[0].message
          });
        }
        return res.status(400).send({
          message: err
        });
      });
  }

  /**
   * Allows a user to sign in
   * @param {object} req
   * @param {object} res
   * @returns  {JSON} Returns success or failure message
   */
  static signInUser(req, res) {
    const { Op } = Sequelize;
    Users
      .findOne({
        where: {
          [Op.or]: [
            { email: req.body.username },
            { username: req.body.username }
          ]
        }
      })
      .then((user) => {
        if (!user) {
          return res.status(400).send({
            error: 'User not found'
          });
        }
        if (bcrypt.compareSync(req.body.password, user.password)) {
          const payload = { id: user.id };
          const token = jwt.sign(payload, process.env.SECRET, {
            expiresIn: '4h' // expires in 4 hours
          });

          // Return the information including token as JSON Value
          res.status(200).send({
            success: true,
            message: 'Token Generated. Signin successful!',
            userId: user.id,
            token,
          });
        } else {
          res.status(400).send({
            error: 'Incorrect Login details'
          });
        }
      })
      .catch(err => res.status(400).send({
        error: err
      }));
  }
}