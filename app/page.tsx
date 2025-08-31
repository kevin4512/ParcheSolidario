import { LoginForm } from "@/components/login-form"

export default function HomePage() {
  return (
    <div className="min-h-screen gradient-exotic floating-shapes flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        <LoginForm />
      </div>
    </div>
  )
}
