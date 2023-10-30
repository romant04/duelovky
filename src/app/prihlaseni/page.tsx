"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { SigninData, SupabaseUser } from "@/types/auth";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/users/user-slice";
import { useRouter } from "next/navigation";
import { InputField } from "@/app/components/auth-forms/input-field";
import { LoadingSpinner } from "@/app/components/loading-spinner";
import { toast } from "react-toastify";

interface Errors {
  emailError: string;
  passwordError: string;
}

export default function Page() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [signData, setSignData] = useState<SigninData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Errors>({
    emailError: "",
    passwordError: "",
  });
  const [sent, setSent] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignData((prevProps) => ({
      ...prevProps,
      [name]: value,
    }));

    if (!sent) return;

    if (name === "email") {
      const res = value === "" ? "Email musí být vyplněn" : "";
      setErrors((prev) => ({
        ...prev,
        emailError: res,
      }));

      return;
    }

    if (name === "password") {
      const res = value === "" ? "Heslo musí být vyplněno" : "";
      setErrors((prev) => ({
        ...prev,
        passwordError: res,
      }));

      return;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSent(true);
    setLoading(true);

    const emailRes = signData.email === "" ? "Email musí být vyplněn" : "";
    const passRes = signData.password === "" ? "Heslo musí být vyplněno" : "";

    if (emailRes !== "" || passRes !== "") {
      setErrors(() => ({
        emailError: emailRes,
        passwordError: passRes,
      }));
      setLoading(false);
      return;
    }

    const res = await fetch("/api/users/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signData),
    });

    if (!res.ok) {
      toast.error("Špatně zadaný email nebo heslo");
      setLoading(false);
      return;
    }

    const data = (await res.json()) as SupabaseUser;
    localStorage.setItem("token", data.uid);
    dispatch(setUser(data));
    router.push("/");
    toast.success("Byl si úspěšně přihlášen");
    setLoading(false);
  };

  return (
    <div className="mx-auto mt-10 flex max-w-xl flex-col justify-start gap-8 px-4">
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl">Přihlášení</h1>
        <div>
          Prihlaš se a můžeš začít prozkoumávat naše hry a vyzvat své kamarády
          nebo se začít utkávat s ostatními pro získání prvních příčkách v
          žebříčku
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-10">
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
        <button
          type="submit"
          className="rounded-sm bg-lime-600 py-2 text-white hover:bg-lime-700"
        >
          {loading ? <LoadingSpinner /> : "Přihlásit"}
        </button>
      </form>
      <p className="self-start">
        Pokud ještě nemáš účet, můžeš se registrovat{" "}
        <a className="text-lime-700 hover:text-lime-800" href="/registrace">
          zde
        </a>
        .
      </p>
    </div>
  );
}
