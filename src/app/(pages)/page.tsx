import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { ProductShowcase } from '@/components/landing/ProductShowcase'
import { SocialProof } from '@/components/landing/SocialProof'
import { FinalCTA } from '@/components/landing/FinalCTA'
import { Footer } from '@/components/landing/Footer'
import { getServerSupabaseClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await getServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <>
      <Navbar session={session} />
      <main>
        <Hero session={session} />
        <ProductShowcase />
        <SocialProof />
        <FinalCTA session={session} />
      </main>
      <Footer />
    </>
  )
}