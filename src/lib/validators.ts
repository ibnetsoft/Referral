import { z } from "zod";

export const signupSchema = z
  .object({
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
      .toUpperCase()
      .regex(/^[A-Z0-9]{6,12}$/, "추천코드 형식이 올바르지 않습니다.")
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호 확인이 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

export const loginSchema = z.object({
  username: z.string().trim().min(1, "아이디를 입력하세요."),
  password: z.string().min(1, "비밀번호를 입력하세요."),
});
