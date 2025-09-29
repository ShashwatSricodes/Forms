import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { FcGoogle } from "react-icons/fc"
import { FaGithub, FaFacebook } from "react-icons/fa"

export default function SignUp(){
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">Signup</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Email" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Password" />
          </div>
          <Button className="w-full">Create an account</Button>

          <Separator className="my-4" />

          <div className="flex flex-col gap-2">
            <Button variant="outline" className="w-full">
              <FcGoogle className="mr-2 h-5 w-5" /> Google
            </Button>
            <Button variant="outline" className="w-full">
              <FaGithub className="mr-2 h-5 w-5" /> Github
            </Button>
            <Button variant="outline" className="w-full">
              <FaFacebook className="mr-2 h-5 w-5 text-blue-600" /> Facebook
            </Button>
          </div>
        </CardContent>

        <CardFooter className="justify-center text-sm">
          Already a user? <a href="/login" className="ml-1 underline">Login</a>
        </CardFooter>
      </Card>
    </div>
  )
}
