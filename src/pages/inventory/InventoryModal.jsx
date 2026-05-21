import {
  X,
} from 'lucide-react'

function InventoryModal({
  shirt,
  onClose,
}) {
  return (
    <div
      onClick={onClose}
      className='fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-5 backdrop-blur-sm'
    >
      <div
        onClick={(e) =>
          e.stopPropagation()
        }
        className='my-8 max-h-[calc(100vh-4rem)] w-full max-w-5xl overflow-y-auto rounded-lg border border-white/10 bg-[#111118]'
      >
        <div className='grid gap-8 p-6 sm:p-8 lg:grid-cols-2 lg:p-10'>
          <div className='flex min-h-[320px] items-center justify-center rounded-lg bg-[#181820] p-6 sm:p-8'>
            <img
              src={shirt.image}
              alt=''
              className='max-h-[500px] object-contain'
            />
          </div>

          <div className='flex min-w-0 flex-col justify-center'>
            <div className='mb-8 flex items-start justify-between gap-5'>
              <div className='min-w-0'>
                <h1 className='break-words text-3xl font-black leading-tight sm:text-4xl'>
                  {shirt.team}
                </h1>

                <p className='mt-3 text-lg text-purple-400'>
                  {shirt.season}
                </p>
              </div>

              <button
                onClick={onClose}
                className='shrink-0 rounded-lg bg-[#181820] p-3 transition-all hover:bg-[#222230]'
              >
                <X size={24} />
              </button>
            </div>

            <div className='space-y-5'>
              <div className='rounded-lg bg-[#181820] p-5'>
                <p className='text-zinc-500 text-sm mb-2'>
                  Liga
                </p>

                <h2 className='break-words text-xl font-bold sm:text-2xl'>
                  {shirt.league}
                </h2>
              </div>

              <div className='rounded-lg bg-[#181820] p-5'>
                <p className='text-zinc-500 text-sm mb-2'>
                  Jugador
                </p>

                <h2 className='break-words text-xl font-bold sm:text-2xl'>
                  {shirt.playerName ||
                    'Sin jugador'}
                </h2>
              </div>

              <div className='grid gap-5 sm:grid-cols-2'>
                <div className='rounded-lg bg-[#181820] p-5'>
                  <p className='text-zinc-500 text-sm mb-2'>
                    Dorsal
                  </p>

                  <h2 className='break-words text-xl font-bold sm:text-2xl'>
                    {shirt.shirtNumber ||
                      'Sin dorsal'}
                  </h2>
                </div>

                <div className='rounded-lg bg-[#181820] p-5'>
                  <p className='text-zinc-500 text-sm mb-2'>
                    Talla
                  </p>

                  <h2 className='break-words text-xl font-bold sm:text-2xl'>
                    {shirt.size ||
                      'Sin talla'}
                  </h2>
                </div>
              </div>

              {shirt.description && (
                <div className='rounded-lg bg-[#181820] p-5'>
                  <p className='text-zinc-500 text-sm mb-2'>
                    Descripción
                  </p>

                  <p className='text-zinc-200 leading-relaxed'>
                    {
                      shirt.description
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InventoryModal
