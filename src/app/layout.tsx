import { Navbar } from '@/components/navigation/utils/Navbar'
import { NotificationListing } from '@/components/notifications/notificationListing'
import { ThermalManagerContextProvider } from '@/thermal/context/thermalManagerContext'
import { getMetadataTitle } from '@/utils/metadata'
import { Link, cn } from '@nextui-org/react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '../components/providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: getMetadataTitle(),
  description: 'GUI pro meteostanici.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className={cn([
          inter.className,
          "h-[100vh]"
        ])}>
          <Providers>

            <ThermalManagerContextProvider>

              <Navbar
                brandContent={<Link href="/" color="foreground" className="font-bold hover:text-primary">LabIR Edu Mikroklima</Link>}
                endContent={<>
                  <Link href="https://github.com/moichim/weather" isBlock color="primary" isExternal showAnchorIcon size='sm' className="hidden md:flex">Github</Link>
                  <Link href="" isBlock color="primary" isExternal showAnchorIcon size='sm'>Discord</Link>
                </>}
                links={[
                  {
                    text: "Týmy",
                    href: "/about/teams",
                  },
                  {
                    text: "O projektu",
                    href: "/about/project",
                  },
                  {
                    text: "O aplikaci",
                    href: "/about/aplication"
                  },
                  {
                    text: "edu.labir.cz",
                    href: "https://edu.labir.cz",
                    target: "_blank",
                    showAnchorIcon: true
                  },
                ]}
              />
              {children}
              <NotificationListing />

            </ThermalManagerContextProvider>

          </Providers>
        </div>
      </body>
    </html>
  )
}
