import { Link, Navigate } from 'react-router-dom'

import {
  Heart,
  MessageCircle,
  Shirt,
  Users,
} from 'lucide-react'

import useAuthStore from '../../store/authStore'

const features = [
  {
    title: 'Inventario',
    text: 'Guarda tus camisetas y consulta tu colección desde cualquier dispositivo.',
    icon: Shirt,
  },
  {
    title: 'Wishlist',
    text: 'Marca las camisetas que quieres conseguir más adelante.',
    icon: Heart,
  },
  {
    title: 'Foro',
    text: 'Comparte publicaciones, fotos y comentarios con la comunidad.',
    icon: MessageCircle,
  },
  {
    title: 'Amigos',
    text: 'Conecta con otros usuarios, mira inventarios y conversa por chat.',
    icon: Users,
  },
]

function Landing() {
  const { token } = useAuthStore()

  if (token) {
    return (
      <Navigate
        to='/forum'
        replace
      />
    )
  }

  return (
    <main className='landing-page'>
      <section className='landing-shell'>
        <nav className='landing-nav'>
          <Link
            to='/'
            className='landing-brand'
          >
            <img
              src='/lowissfut-logo.jpg'
              alt='LowissFut'
              className='landing-brand-logo'
            />
            <span className='landing-brand-name'>
              LowissFut
            </span>
          </Link>

          <div className='landing-nav-actions'>
            <Link
              to='/login'
              className='landing-button landing-button-ghost'
            >
              Login
            </Link>
            <Link
              to='/register'
              className='landing-button landing-button-primary'
            >
              Registro
            </Link>
          </div>
        </nav>

        <div className='landing-hero'>
          <div className='landing-copy'>
            <p className='landing-eyebrow'>
              Colección de camisetas de fútbol
            </p>
            <h1 className='landing-title'>
              Organiza tu colección y comparte tu pasión.
            </h1>
            <p className='landing-text'>
              LowissFut une inventario, wishlist, foro, amigos y chat en una sola app para coleccionistas de camisetas.
            </p>

            <div className='landing-cta-row'>
              <Link
                to='/register'
                className='landing-button landing-button-primary landing-button-large'
              >
                Crear cuenta
              </Link>
              <Link
                to='/login'
                className='landing-button landing-button-ghost landing-button-large'
              >
                Ya tengo cuenta
              </Link>
            </div>
          </div>

          <div className='landing-logo-card'>
            <img
              src='/lowissfut-logo.jpg'
              alt='Logo de LowissFut'
              className='landing-logo'
            />
          </div>
        </div>

        <section className='landing-disclaimer'>
          <p>
            Esta página web forma parte de un trabajo escolar. LowissFut no busca interés monetario, no vende camisetas y se ha creado con fines educativos para practicar desarrollo web y organización de colecciones.
          </p>
        </section>

        <section className='landing-features'>
          {features.map((feature) => {
            const Icon = feature.icon

            return (
              <article
                key={feature.title}
                className='landing-feature'
              >
                <div className='landing-feature-icon'>
                  <Icon size={18} />
                </div>
                <h2 className='landing-feature-title'>
                  {feature.title}
                </h2>
                <p className='landing-feature-text'>
                  {feature.text}
                </p>
              </article>
            )
          })}
        </section>
      </section>
    </main>
  )
}

export default Landing
