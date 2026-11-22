
//verifica se o utilizador está permitido na rota

module.exports = function checkRole(rolesPermitidos) {
  return function (req, res, next) {
    if (!req.user || !rolesPermitidos.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Não tens permissão para esta ação" });
    }
    next();
  };
};
