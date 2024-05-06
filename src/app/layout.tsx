import { Navbar } from '@/components/ui/navigation/Navbar'
import { NotificationListing } from '@/modules/notifications/components/notificationListing'
import { ThermalManagerContextProvider } from '@/modules/thermal/context/thermalManagerContext'
import { getMetadataTitle } from '@/utils/metadata'
import { Link, cn } from '@nextui-org/react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '../components/providers'
import './globals.css'
import { Toolbar } from '@/components/ui/toolbar/Toolbar'

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

              <Toolbar
                label={<Link href="/" color="foreground" className="font-bold hover:text-primary">LabIR Edu Mikroklima</Link>}
                menu={[
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
