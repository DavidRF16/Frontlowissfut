import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import toast from 'react-hot-toast'
import {
  Link,
  useParams,
} from 'react-router-dom'

import {
  Filter,
  Lock,
  Search,
  Shirt,
  Trash2,
} from 'lucide-react'

import {
  getInventory,
  getUserInventory,
  deleteInventoryShirt,
} from '../../services/inventoryService'

import {
  getUserProfile,
} from '../../services/userService'

import InventoryModal from './InventoryModal'

import {
  filterShirts,
  getFilterValues,
  getShirtTitle,
  getVisiblePages,
  shirtsPerPage,
} from '../../utils/shirtCollection'

function Inventory() {
  const { userId } = useParams()

  const [shirts, setShirts] =
    useState([])

  const [selectedShirt, setSelectedShirt] =
    useState(null)

  const [owner, setOwner] =
    useState(null)

  const [isPrivate, setIsPrivate] =
    useState(false)
  const [search, setSearch] =
    useState('')
  const [league, setLeague] =
    useState('')
  const [season, setSeason] =
    useState('')
  const [team, setTeam] =
    useState('')
  const [currentPage, setCurrentPage] =
    useState(1)

  const isOwnInventory = !userId

  const fetchInventory =
    async () => {
      try {
        setIsPrivate(false)

        if (userId) {
          const profile =
            await getUserProfile(userId)

          setOwner(profile.user)
        } else {
          setOwner(null)
        }

        const data = userId
          ? await getUserInventory(userId)
          : await getInventory()

        setShirts(data)
      } catch (error) {
        if (
          error.response?.status ===
          403
        ) {
          setIsPrivate(true)
          return
        }

        toast.error(
          error.response?.data
            ?.message ||
            'Error cargando inventario'
        )
      }
    }

  useEffect(() => {
    fetchInventory()
  }, [userId])

  const filterValues = useMemo(
    () =>
      getFilterValues(shirts, {
        search,
        league,
        season,
        team,
      }),
    [shirts, search, league, season, team]
  )

  const filteredShirts = useMemo(
    () =>
      filterShirts(shirts, {
        search,
        league,
        season,
        team,
      }),
    [shirts, search, league, season, team]
  )

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredShirts.length /
        shirtsPerPage
    )
  )

  const paginatedShirts = useMemo(
    () =>
      filteredShirts.slice(
        (currentPage - 1) *
          shirtsPerPage,
        currentPage *
          shirtsPerPage
      ),
    [filteredShirts, currentPage]
  )

  const visiblePages = useMemo(
    () =>
      getVisiblePages(
        currentPage,
        totalPages
      ),
    [currentPage, totalPages]
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [search, league, season, team, userId])

  useEffect(() => {
    if (
      league &&
      !filterValues.leagues.includes(
        league
      )
    ) {
      setLeague('')
    }

    if (
      season &&
      !filterValues.seasons.includes(
        season
      )
    ) {
      setSeason('')
    }

    if (
      team &&
      !filterValues.teams.includes(
        team
      )
    ) {
      setTeam('')
    }
  }, [
    filterValues,
    league,
    season,
    team,
  ])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const handleDelete =
    async (id) => {
      try {
        await deleteInventoryShirt(
          id
        )

        setShirts((prev) =>
          prev.filter(
            (shirt) =>
              shirt._id !== id
          )
        )

        toast.success(
          'Camiseta eliminada'
        )
      } catch (error) {
        toast.error(
          'Error eliminando'
        )
      }
    }

  return (
    <div className='page-stack mx-auto max-w-5xl pb-10'>
      <header className='page-header rounded-lg border border-white/10 bg-[#10151f] shadow-xl shadow-black/10'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <h1 className='text-2xl font-black text-white sm:text-3xl'>
            {owner
              ? `Inventario de ${owner.username}`
              : 'Inventario'}
          </h1>

          {!isPrivate && (
            <span className='w-fit rounded-md bg-violet-600/20 px-3 py-1 text-xs font-bold text-violet-100'>
              {shirts.length} camisetas
            </span>
          )}
        </div>
      </header>

      {isPrivate ? (
        <div className='rounded-lg border border-dashed border-white/15 bg-white/[0.02] p-10 text-center'>
          <Lock
            className='mx-auto text-violet-300'
            size={36}
          />
          <p className='mt-4 text-lg font-bold text-white'>
            Este inventario es privado.
          </p>
          <Link
            to={
              userId
                ? `/profile/${userId}`
                : '/profile'
            }
            className='mt-5 inline-flex min-h-11 items-center justify-center rounded-lg border border-white/10 px-5 text-sm font-bold text-white transition hover:border-violet-400'
          >
            Volver al perfil
          </Link>
        </div>
      ) : shirts.length === 0 ? (
        <div className='rounded-lg border border-dashed border-white/15 bg-white/[0.02] p-10 text-center'>
          <Shirt
            className='mx-auto text-violet-300'
            size={36}
          />
          <p className='mt-4 text-lg font-bold text-white'>
            {owner
              ? 'Este usuario no tiene camisetas todavía.'
              : 'No tienes camisetas todavía.'}
          </p>
        </div>
      ) : (
        <>
          <section className='page-section rounded-lg border border-white/10 bg-[#10151f]'>
            <div className='grid gap-4 lg:grid-cols-[minmax(0,1fr)_200px_200px_200px]'>
              <label className='relative'>
                <Search
                  className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500'
                  size={18}
                />
                <input
                  type='text'
                  placeholder='Buscar camiseta, equipo o temporada'
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className='h-12 w-full rounded-lg border border-white/10 bg-[#0b0f17] pl-10 pr-4 text-sm text-white outline-none focus:border-violet-400'
                />
              </label>

              <select
                value={league}
                onChange={(e) =>
                  setLeague(e.target.value)
                }
                className='h-12 rounded-lg border border-white/10 bg-[#0b0f17] px-4 text-sm text-white outline-none focus:border-violet-400'
              >
                <option value=''>
                  Todas las ligas
                </option>
                {filterValues.leagues.map(
                  (value) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {value}
                    </option>
                  )
                )}
              </select>

              <select
                value={season}
                onChange={(e) =>
                  setSeason(e.target.value)
                }
                className='h-12 rounded-lg border border-white/10 bg-[#0b0f17] px-4 text-sm text-white outline-none focus:border-violet-400'
              >
                <option value=''>
                  Todos los años
                </option>
                {filterValues.seasons.map(
                  (value) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {value}
                    </option>
                  )
                )}
              </select>

              <select
                value={team}
                onChange={(e) =>
                  setTeam(e.target.value)
                }
                className='h-12 rounded-lg border border-white/10 bg-[#0b0f17] px-4 text-sm text-white outline-none focus:border-violet-400'
              >
                <option value=''>
                  Todos los equipos
                </option>
                {filterValues.teams.map(
                  (value) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {value}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className='mt-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500'>
              <Filter size={15} />
              Filtros de inventario
            </div>
          </section>

          {filteredShirts.length === 0 ? (
            <div className='rounded-lg border border-dashed border-white/15 bg-white/[0.02] p-10 text-center'>
              <Shirt
                className='mx-auto text-violet-300'
                size={36}
              />
              <p className='mt-4 text-lg font-bold text-white'>
                No hay camisetas con esos filtros.
              </p>
            </div>
          ) : (
            <div className='card-list flex flex-wrap justify-center gap-7 sm:justify-start'>
              {paginatedShirts.map((shirt) => (
                <div
                  key={shirt._id}
                  className='relative w-full sm:w-[260px]'
                >
                  {isOwnInventory && (
                    <button
                      type='button'
                      onClick={() =>
                        handleDelete(
                          shirt._id
                        )
                      }
                      className='absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-lg bg-red-500/90 text-white shadow-lg shadow-black/30 transition hover:bg-red-500'
                      aria-label='Eliminar camiseta'
                    >
                      <Trash2 size={16} />
                    </button>
                  )}

                  <button
                    type='button'
                    onClick={() =>
                      setSelectedShirt(
                        shirt
                      )
                    }
                    className='w-full overflow-hidden rounded-lg border border-white/10 bg-[#10151f] text-left transition hover:border-violet-400/50'
                  >
                    <div className='flex h-52 items-center justify-center bg-[#0b0f17] p-5'>
                      <img
                        src={shirt.image}
                        alt=''
                        className='max-h-full object-contain'
                      />
                    </div>

                    <div className='p-4'>
                      <h2 className='line-clamp-2 text-base font-bold leading-snug text-white'>
                        {getShirtTitle(shirt)}
                      </h2>

                      <p className='mt-1 text-sm text-slate-400'>
                        {shirt.team}
                      </p>

                      <p className='mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500'>
                        {shirt.season} /{' '}
                        {shirt.league}
                      </p>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          )}

          {filteredShirts.length > 0 && (
            <div className='flex flex-col items-center justify-between gap-4 rounded-lg border border-white/10 bg-[#10151f] p-4 sm:flex-row'>
              <p className='text-sm text-slate-400'>
                Página {currentPage} de{' '}
                {totalPages} -{' '}
                {filteredShirts.length}{' '}
                camisetas
              </p>

              <div className='flex flex-wrap justify-center gap-2'>
                <button
                  type='button'
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.max(1, page - 1)
                    )
                  }
                  disabled={currentPage === 1}
                  className='min-h-10 rounded-lg border border-white/10 px-4 text-sm font-bold text-white transition hover:border-violet-400 disabled:cursor-not-allowed disabled:opacity-40'
                >
                  Anterior
                </button>

                {visiblePages.map((page) =>
                  typeof page === 'string' ? (
                    <span
                      key={page}
                      className='grid h-10 w-8 place-items-center text-sm font-black text-slate-500'
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      type='button'
                      onClick={() =>
                        setCurrentPage(page)
                      }
                      className={`grid h-10 w-10 place-items-center rounded-lg border text-sm font-black transition ${
                        currentPage ===
                        page
                          ? 'border-violet-400 bg-violet-600 text-white'
                          : 'border-white/10 text-slate-300 hover:border-violet-400'
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  type='button'
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.min(
                        totalPages,
                        page + 1
                      )
                    )
                  }
                  disabled={
                    currentPage === totalPages
                  }
                  className='min-h-10 rounded-lg border border-white/10 px-4 text-sm font-bold text-white transition hover:border-violet-400 disabled:cursor-not-allowed disabled:opacity-40'
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {selectedShirt && (
        <InventoryModal
          shirt={selectedShirt}
          onClose={() =>
            setSelectedShirt(
              null
            )
          }
        />
      )}
    </div>
  )
}

export default Inventory
