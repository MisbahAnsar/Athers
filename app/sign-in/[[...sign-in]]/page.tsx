// app/sign-in/page.tsx or pages/sign-in.tsx
import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <SignIn />
    </div>
  )
}
