import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  Filter,
  Search,
  Star,
  Trash2,
} from 'lucide-react'

import toast from 'react-hot-toast'

import {
  deleteWishlistShirt,
  getWishlist,
} from '../../services/wishlistService'

import {
  filterShirts,
  getFilterValues,
  getShirtTitle,
  getVisiblePages,
  shirtsPerPage,
} from '../../utils/shirtCollection'

function Wishlist() {
  const [shirts, setShirts] =
    useState([])
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

  const fetchWishlist =
    async () => {
      try {
        const data =
          await getWishlist()

        setShirts(data)
      } catch (error) {
        toast.error(
          'Error cargando wishlist'
        )
      }
    }

  useEffect(() => {
    fetchWishlist()
  }, [])

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
  }, [search, league, season, team])

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
        await deleteWishlistShirt(
          id
        )

        setShirts((prev) =>
          prev.filter(
            (shirt) =>
              shirt._id !== id
          )
        )

        toast.success(
          'Eliminada'
        )
      } catch (error) {
        toast.error('Error')
      }
    }

  return (
    <div className='page-stack mx-auto max-w-5xl'>
      <header className='page-header rounded-lg border border-white/10 bg-[#10151f] shadow-xl shadow-black/10'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <h1 className='text-2xl font-black text-white sm:text-3xl'>
            Wishlist
          </h1>

          <span className='w-fit rounded-md bg-violet-600/20 px-3 py-1 text-xs font-bold text-violet-100'>
            {shirts.length} guardadas
          </span>
        </div>
      </header>

      {shirts.length === 0 ? (
        <div className='rounded-lg border border-dashed border-white/15 bg-white/[0.02] p-10 text-center'>
          <Star
            className='mx-auto text-violet-300'
            size={36}
          />
          <h2 className='mt-4 text-lg font-bold text-white'>
            Wishlist vacía
          </h2>
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
              Filtros de wishlist
            </div>
          </section>

          {filteredShirts.length === 0 ? (
            <div className='rounded-lg border border-dashed border-white/15 bg-white/[0.02] p-10 text-center'>
              <Star
                className='mx-auto text-violet-300'
                size={36}
              />
              <h2 className='mt-4 text-lg font-bold text-white'>
                No hay camisetas con esos filtros.
              </h2>
            </div>
          ) : (
            <div className='card-list flex flex-wrap justify-center gap-7 sm:justify-start'>
              {paginatedShirts.map((shirt) => (
                <article
                  key={shirt._id}
                  className='w-full overflow-hidden rounded-lg border border-white/10 bg-[#10151f] sm:w-[260px]'
                >
                  <img
                    src={shirt.image}
                    alt=''
                    className='h-52 w-full bg-[#0b0f17] object-contain p-5'
                  />

                  <div className='p-5'>
                    <h2 className='line-clamp-2 text-base font-bold text-white'>
                      {getShirtTitle(shirt)}
                    </h2>

                    <p className='mt-1 text-sm text-slate-400'>
                      {shirt.team}
                    </p>

                    <p className='mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500'>
                      {shirt.season} /{' '}
                      {shirt.league}
                    </p>

                    <button
                      type='button'
                      onClick={() =>
                        handleDelete(
                          shirt._id
                        )
                      }
                      className='mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-red-500/15 text-sm font-bold text-red-200 transition hover:bg-red-500/25'
                    >
                      <Trash2 size={17} />
                      Eliminar
                    </button>
                  </div>
                </article>
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
    </div>
  )
}

export default Wishlist
