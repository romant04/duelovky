"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { validateEmail, validatePassword } from "@/utils/formUtils";
import { SigninApiResponse, SignupData } from "@/types/auth";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setUser } from "@/store/users/user-slice";
import { InputField } from "@/app/components/auth-forms/input-field";

interface Errors {
  usernameError: string;
  emailError: string;
  passwordError: string;
  passwordError2: string;
}

export default function Page() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [signData, setSignData] = useState<SignupData>({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const [errors, setErrors] = useState<Errors>({
    usernameError: "",
    emailError: "",
    passwordError: "",
    passwordError2: "",
  });
  const [sent, setSent] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignData((prevProps) => ({
      ...prevProps,
      [name]: value,
    }));

    if (!sent) return;

    if (name === "username") {
      const res = value === "" ? "Přezdívka musí být vyplněna" : "";
      setErrors((prev) => ({
        ...prev,
        usernameError: res,
      }));

      return;
    }

    if (name === "email") {
      const res = validateEmail(value);
      setErrors((prev) => ({
        ...prev,
        emailError: res,
      }));

      return;
    }

    if (name === "password") {
      const res = validatePassword(value);
      setErrors((prev) => ({
        ...prev,
        passwordError: res,
      }));

      return;
    }

    if (name === "password2") {
      const res = signData.password === value ? "" : "Hesla se neshodují";
      setErrors((prev) => ({
        ...prev,
        passwordError2: res,
      }));

      return;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSent(true);

    const usernameRes =
      signData.username === "" ? "Přezdívka musí být vyplněna" : "";
    const emailRes = validateEmail(signData.email);
    const passRes = validatePassword(signData.password);
    const pass2Res =
      signData.password === signData.password2 ? "" : "Hesla se neshodují";

    if (
      emailRes !== "" ||
      passRes !== "" ||
      pass2Res !== "" ||
      usernameRes !== ""
    ) {
      setErrors(() => ({
        usernameError: usernameRes,
        emailError: emailRes,
        passwordError: passRes,
        passwordError2: pass2Res,
      }));
      return;
    }

    const res = await fetch("/api/firebase/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signData),
    });

    const data = (await res.json()) as SigninApiResponse;
    localStorage.setItem("token", data.id);
    dispatch(setUser(data.userData));
    router.push("/");
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center justify-center gap-8">
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl">Registrace</h1>
        <div>
          Registruj se a můžeš začít prozkoumávat naše hry a vyzvat své kamarády
          nebo se začít utkávat s ostatními pro získání prvních příčkách v
          žebříčku
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-10">
        <InputField
          name="username"
          error={errors.usernameError}
          label="Přezdívka"
          type="text"
          handleInputChange={handleInputChange}
        />
        <InputField
          name="email"
          error={errors.emailError}
          label="Email"
          type="email"
          handleInputChange={handleInputChange}
        />
        <InputField
          name="password"
          error={errors.passwordError}
          label="Heslo"
          type="password"
          handleInputChange={handleInputChange}
        />
        <InputField
          name="password2"
          error={errors.passwordError2}
          label="Potvrzení hesla"
          type="password"
          handleInputChange={handleInputChange}
        />
        <button
          type="submit"
          className="rounded-sm bg-lime-600 py-2 text-white hover:bg-lime-700"
        >
          Registrovat
        </button>
      </form>
      <p className="self-start">
        Máš už účet ?, můžeš se přihlásit{" "}
        <a className="text-lime-700 hover:text-lime-800" href="/prihlaseni">
          zde
        </a>
        .
      </p>
    </div>
  );
}