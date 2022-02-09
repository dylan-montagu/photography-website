const express = require('express');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verifyToken, isAdmin } = require('../../middleware/auth');

const User = require('../../models/User');
const Role = require('../../models/Role');

const router = express.Router();

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
  '/',
  [
    verifyToken,
    isAdmin,
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
    check('roles', 'Include desired role').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, roles } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      const userRoles = await Promise.all(
        roles.map(async (roleName) => {
          const role = await Role.findOne({ name: roleName });
          return new mongoose.Types.ObjectId(role._id);
        })
      );

      user = new User({
        email,
        password,
        roles: userRoles,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '100 days' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      await User.findOneAndDelete({ email });
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   DELETE api/users/:user_id
// @desc    Delete a user
// @access  Admin
router.delete('/:user_id', [verifyToken, isAdmin], async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.user_id);
    return res.sendStatus(200);
  } catch (err) {
    console.error(err.message);
    return res.sendStatus(500);
  }
});

// @route   GET api/users
// @desc    Get all users
// @access  Admin
router.get('/', [verifyToken, isAdmin], async (req, res) => {
  try {
    const users = await User.find().populate('roles');
    return res.json(users);
  } catch (error) {
    return res.sendStatus(500);
  }
});

module.exports = router;
