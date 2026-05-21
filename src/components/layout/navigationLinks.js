import {
  Bell,
  CirclePlus,
  Heart,
  House,
  Shirt,
  User,
  Users,
} from 'lucide-react'

const navigationLinks = [
  {
    name: 'Foro',
    shortName: 'Foro',
    path: '/forum',
    icon: House,
  },
  {
    name: 'Amigos',
    shortName: 'Amigos',
    path: '/friends',
    icon: Users,
  },
  {
    name: 'Inventario',
    shortName: 'Inv.',
    path: '/inventory',
    icon: Shirt,
  },
  {
    name: 'Añadir camisetas',
    shortName: 'Añadir',
    path: '/camisetas',
    icon: CirclePlus,
  },
  {
    name: 'Wishlist',
    shortName: 'Wish',
    path: '/wishlist',
    icon: Heart,
  },
  {
    name: 'Notificaciones',
    shortName: 'Avisos',
    path: '/notifications',
    icon: Bell,
  },
  {
    name: 'Perfil',
    shortName: 'Perfil',
    path: '/profile',
    icon: User,
  },
]

export default navigationLinks
