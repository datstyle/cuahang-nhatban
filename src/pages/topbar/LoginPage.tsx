import { Navigate } from "react-router-dom";
import useAuth from "../../types/useAuth";
import AuthLayout from "../../components/account/AuthLayout";
import LoginForm from "../../components/account/LoginForm";

export default function LoginPage() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/"} replace />;
  }

  return (
    <AuthLayout mode="login">
      <LoginForm />
    </AuthLayout>
  );
}
