const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Sử dụng body-parser để parse dữ liệu từ POST request
app.use(bodyParser.json());

// Dữ liệu giả lập (thực tế sẽ dùng cơ sở dữ liệu)
const users = [];

// API đăng ký
app.post('/register', async (req, res) => {
  const { email, password, username } = req.body;

  // Kiểm tra nếu email đã tồn tại
  const userExists = users.find(user => user.email === email);
  if (userExists) {
    return res.status(400).json({ message: 'Email đã được đăng ký!' });
  }

  // Mã hóa mật khẩu
  const hashedPassword = await bcrypt.hash(password, 10);

  // Tạo người dùng mới
  const newUser = { email, password: hashedPassword, username };
  users.push(newUser);

  return res.status(201).json({ message: 'Đăng ký thành công!' });
});

// API đăng nhập
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Kiểm tra nếu người dùng tồn tại
  const user = users.find(user => user.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Email không tồn tại!' });
  }

  // Kiểm tra mật khẩu
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Mật khẩu sai!' });
  }

  // Tạo token
  const token = jwt.sign({ email: user.email, username: user.username }, 'secretkey', { expiresIn: '1h' });

  return res.status(200).json({ message: 'Đăng nhập thành công!', token });
});

// Chạy server
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
