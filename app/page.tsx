import { LoginForm } from "@/components/login-form"

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 via-blue-700 to-blue-400 dark:from-blue-950 dark:via-blue-900 dark:to-blue-800">
      <LoginForm />
    </div>
  )
}

