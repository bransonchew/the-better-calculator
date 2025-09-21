import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Github from '@/components/logo/github'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import LinkedIn from '@/components/logo/linkedin'
import { Separator } from '@/components/ui/separator'
import { ExternalLink } from 'lucide-react'

export default function Page() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold text-center">
        About
      </h1>
      <Card>
        <CardContent className="space-y-8 px-6 sm:px-12 lg:px-16 py-4 sm:pt-6 sm:pb-12">

          {/*Author Info*/ }
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="px-6">
              <Avatar className="size-48">
                <AvatarImage
                  src="https://github.com/bransonchew.png"
                />
                <AvatarFallback>BC</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col justify-center space-y-6">
              <div className="flex flex-col items-center sm:items-start gap-1">
                <h2 className="text-3xl font-semibold">Branson Chew</h2>
                <span className="">Author and developer</span>
              </div>
              <div className="flex sm:flex-col items-center sm:items-start justify-center gap-3 font-medium text-sm">
                <Link
                  href="https://github.com/bransonchew"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:underline underline-offset-4 group"
                >
                  <Github/> Github
                  <ExternalLink className="size-3.5 hidden group-hover:inline -ml-0.5"/>
                </Link>
                <Link
                  href="https://www.linkedin.com/in/bransonchew"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:underline underline-offset-4 group"
                >
                  <LinkedIn/> LinkedIn
                  <ExternalLink className="size-3.5 hidden group-hover:inline -ml-0.5"/>
                </Link>
              </div>
            </div>
          </div>

          <Separator/>

          {/* Main Content */ }
          <div className="space-y-10 leading-relaxed">

            {/* Who Made This */ }
            <section className="space-y-3">
              <h2 className="text-xl font-semibold">‍🧑‍💻 Who Made This</h2>
              <p>
                Hi, I’m Branson Chew, the developer behind The Better Calculator.
                I’m a software enthusiast who enjoys building practical tools that make
                everyday tasks simpler. Beyond code, I’m passionate about solving real-world
                problems, experimenting with UI/UX, and sharing projects openly with the
                community.
              </p>
            </section>

            {/* Why This App */ }
            <section className="space-y-3">
              <h2 className="text-xl font-semibold">🎓 Why This App</h2>
              <p>
                This project was created to help { ' ' }
                <Link
                  href="https://www.monash.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Monash University official website"
                  className="font-bold hover:underline underline-offset-4 dark:text-amber-500"
                >
                  Monash University
                </Link>
                { ' ' } students manage and understand their academic performance more clearly.
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>The official systems can feel clunky or limited.</li>
                <li>
                  Many students want a simple, visual way to track grades, calculate GPA/WAM,
                  and project outcomes.
                </li>
                <li>
                  The Better Calculator exists to make those tasks quick,
                  accessible, and intuitive — no sign-ins, no hassle.
                </li>
              </ul>
            </section>

            {/* Key Designs */ }
            <section className="space-y-3">
              <h2 className="text-xl font-semibold">💡 Key Designs</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>No Accounts Needed:</strong> Everything stays on your device,
                  keeping things private and simple.
                </li>
                <li>
                  <strong>Fully Client-Side:</strong> All data is stored locally in your
                  browser. Nothing is uploaded or tracked.
                </li>
                <li>
                  <strong>Save/Import Data:</strong> Save your data and load it back anytime
                  with the built-in <em>Save As</em> and <em>Import</em> features.
                </li>
                <li>
                  <strong>Free & Open Source:</strong> The project is free to use and open to
                  contributions at { ' ' }
                  <Link
                    href="https://github.com/bransonchew/the-better-calculator"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View source code on GitHub"
                    className="font-bold hover:underline underline-offset-4 dark:text-amber-500"
                  >
                    GitHub
                  </Link>
                  .
                </li>
                <li>
                  <strong>Responsive by Design:</strong> Whether you’re on mobile 📱 or
                  desktop 💻, the experience is consistent and accessible.
                </li>
              </ul>
            </section>

            {/* Note */ }
            <section className="space-y-3">
              <h2 className="text-xl font-semibold">🌍 A Note</h2>
              <p>
                The Better Calculator is <em>NOT affiliated with Monash
                University</em>. It’s an independent project made by a fellow developer
                who saw a need and built a tool for the student community.
              </p>
              <p>
                While I strive to keep The Better Calculator accurate and
                up-to-date, it’s always a good idea to double-check calculations with { ' ' }
                <Link
                  href="https://www.monash.edu/students/admin/assessments/results/gpa"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View source code on GitHub"
                  className="font-bold hover:underline underline-offset-4 dark:text-amber-500"
                >
                  official university resources
                </Link>
                .{ ' ' } If you spot any issues or have suggestions,
                please feel free to reach out via the GitHub repository!
              </p>
            </section>

          </div>

        </CardContent>
      </Card>
    </div>
  )
}
