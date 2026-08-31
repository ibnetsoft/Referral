import { z } from "zod";

export const signupSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "이름을 입력하세요.")
      .max(50, "이름은 50자 이하여야 합니다."),
    phoneNumber: z
      .string()
      .trim()
      .regex(
        /^[0-9]{2,4}-?[0-9]{3,4}-?[0-9]{4}$/,
        "핸드폰번호 형식이 올바르지 않습니다.",
      ),
    username: z
      .string()
      .trim()
      .regex(/^[A-Za-z0-9_]{4,20}$/, "아이디는 4~20자의 영문, 숫자, 밑줄만 가능합니다."),
    password: z
      .string()
      .min(8, "비밀번호는 8자 이상이어야 합니다.")
      .max(72, "비밀번호는 72자 이하여야 합니다."),
    passwordConfirm: z.string(),
    referralCode: z
      .string()
      .trim()
      .toUpperCase(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호 확인이 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

export const loginSchema = z.object({
  username: z.string().trim().min(1, "아이디를 입력하세요."),
  password: z.string().min(1, "비밀번호를 입력하세요."),
});
