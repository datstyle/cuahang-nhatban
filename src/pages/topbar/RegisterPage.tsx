import { Navigate } from "react-router-dom";
import useAuth from "../../types/useAuth";
import AuthLayout from "../../components/account/AuthLayout";
import RegisterForm from "../../components/account/RegisterForm";

export default function RegisterPage() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthLayout mode="register">
      <RegisterForm />
    </AuthLayout>
  );
}
