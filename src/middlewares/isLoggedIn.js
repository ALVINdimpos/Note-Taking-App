const jwt = require('jsonwebtoken');

// eslint-disable-next-line consistent-return
const isLoggedIn = async (req, res, next) => {
  const token = req.headers.authorization || req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = userId;
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = isLoggedIn;