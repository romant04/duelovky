export const validateEmail = (email: string) => {
  if (email == "") {
    return "Email musí být vyplněn";
  }

  if (
    !email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  ) {
    return "Email musí být ve správném formátu";
  }

  return "";
};

export const validatePassword = (password: string) => {
  if (password == "") {
    return "Heslo musí být vyplněno";
  }

  if (password.length < 6) {
    return "Heslo musí mít alespoň 6 znaků";
  }

  if (password.search(/\d/) == -1) {
    return "Heslo musí obsahovat číslice";
  }

  if (password.search(/[a-zA-Z]/) == -1) {
    return "Heslo musí obsahovat písmena";
  }

  return "";
};
