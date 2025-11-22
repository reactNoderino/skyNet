import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AUTH_STORAGE_KEY } from "../../config";
import ForgotPasswordModal from "../ForgotPasswordModal/ForgotPasswordModal";
import styles from "./LoginForm.module.css";
import { loginUser } from "../../redux/slices/authSlice";

const schema = yup.object({
  email: yup.string().required("Email is required"),
  password: yup.string().required("Password is required"),
});

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setServerError("");

    const result = await dispatch(loginUser(data));

    // SUCCESS
    if (loginUser.fulfilled.match(result)) {
      const payload = result.payload;

      // 📌 Token & user localStorage'a yazılabilir (isteğe bağlı)
      if (payload?.token && payload?.refreshToken && payload?.user) {
        localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({
            token: payload.token,
            refreshToken: payload.refreshToken,
            user: payload.user,
          })
        );
      }

      navigate("/home");
      return;
    }

    // ERROR
    setServerError(result.payload?.message || "Login failed. Please try again.");
  };

  return (
    <form className={styles.loginForm} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={styles.formGroup}>
        <input
          type="email"
          placeholder="Enter your email"
          className={`${styles.formInput} ${errors.email ? styles.formInputError : ""}`}
          {...register("email")}
        />
        {errors.email && <span className={styles.errorMessage}>{errors.email.message}</span>}
      </div>

      <div className={styles.formGroup}>
        <div className={styles.passwordInputWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className={`${styles.formInput} ${errors.password ? styles.formInputError : ""}`}
            {...register("password")}
          />

          <button type="button" className={styles.passwordToggle} onClick={() => setShowPassword(!showPassword)}>
            <svg
              className={styles.eyeIcon}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {showPassword ? (
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />
              ) : (
                <>
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </>
              )}
            </svg>
          </button>
        </div>

        {errors.password && <span className={styles.errorMessage}>{errors.password.message}</span>}
      </div>

      {serverError && <div className={styles.submitError}>{serverError}</div>}

      <button type="submit" className={styles.btnSubmit} disabled={isSubmitting}>
        {isSubmitting ? "Logging in..." : "Log In Now"}
      </button>

      <button type="button" className={styles.forgotPasswordButton} onClick={() => setIsForgotModalOpen(true)}>
        Forgot password
      </button>

      <ForgotPasswordModal isOpen={isForgotModalOpen} onClose={() => setIsForgotModalOpen(false)} />
    </form>
  );
}

export default LoginForm;
