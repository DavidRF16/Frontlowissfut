import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  Filter,
  Search,
  Shirt,
  X,
} from 'lucide-react'

import {
  filterShirts,
  getFilterValues,
  getShirtTitle,
  getVisiblePages,
  shirtsPerPage,
} from '../../utils/shirtCollection'

function PublicInventoryModal({
  owner,
  shirts,
  onClose,
}) {
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

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm'>
      <section className='max-h-[calc(100vh-3rem)] w-full max-w-5xl overflow-y-auto rounded-lg border border-white/10 bg-[#10151f] p-5 shadow-2xl shadow-black/50 sm:p-6'>
        <div className='flex items-center justify-between gap-4 border-b border-white/10 pb-4'>
          <div>
            <h2 className='text-xl font-black text-white'>
              Inventario de{' '}
              {owner?.username ||
                'usuario'}
            </h2>
            <p className='mt-1 text-sm text-slate-500'>
              {filteredShirts.length} de{' '}
              {shirts.length} camisetas visibles
            </p>
          </div>

          <button
            type='button'
            onClick={onClose}
            className='grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 text-slate-400 transition hover:border-red-400/60 hover:text-red-200'
            aria-label='Cerrar inventario'
          >
            <X size={17} />
          </button>
        </div>

        {shirts.length > 0 && (
          <section className='mt-5 rounded-lg border border-white/10 bg-[#0b0f17] p-4'>
            <div className='grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px_180px]'>
              <label className='relative'>
                <Search
                  className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500'
                  size={18}
                />
                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder='Buscar camiseta, equipo o temporada'
                  className='h-11 w-full rounded-lg border border-white/10 bg-[#10151f] pl-10 pr-4 text-sm text-white outline-none focus:border-violet-400'
                />
              </label>

              <select
                value={league}
                onChange={(e) =>
                  setLeague(e.target.value)
                }
                className='h-11 rounded-lg border border-white/10 bg-[#10151f] px-3 text-sm text-white outline-none focus:border-violet-400'
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
                className='h-11 rounded-lg border border-white/10 bg-[#10151f] px-3 text-sm text-white outline-none focus:border-violet-400'
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
                className='h-11 rounded-lg border border-white/10 bg-[#10151f] px-3 text-sm text-white outline-none focus:border-violet-400'
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

            <div className='mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500'>
              <Filter size={15} />
              Filtros de inventario
            </div>
          </section>
        )}

        {shirts.length === 0 ? (
          <div className='py-12 text-center'>
            <Shirt
              className='mx-auto text-violet-300'
              size={36}
            />
            <p className='mt-4 text-sm text-slate-500'>
              No hay camisetas visibles.
            </p>
          </div>
        ) : filteredShirts.length === 0 ? (
          <div className='py-12 text-center'>
            <Shirt
              className='mx-auto text-violet-300'
              size={36}
            />
            <p className='mt-4 text-sm text-slate-500'>
              No hay camisetas con esos filtros.
            </p>
          </div>
        ) : (
          <div className='mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
            {paginatedShirts.map(
              (shirt) => (
                <article
                  key={shirt._id}
                  className='overflow-hidden rounded-lg border border-white/10 bg-[#0b0f17]'
                >
                  <img
                    src={shirt.image}
                    alt=''
                    className='h-52 w-full bg-[#080b10] object-contain p-5'
                  />
                  <div className='p-4'>
                    <h3 className='line-clamp-2 text-sm font-bold text-white'>
                      {getShirtTitle(shirt)}
                    </h3>
                    <p className='mt-1 text-sm text-slate-400'>
                      {shirt.team}
                    </p>
                    <p className='mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500'>
                      {shirt.season} /{' '}
                      {shirt.league}
                    </p>
                  </div>
                </article>
              )
            )}
          </div>
        )}

        {filteredShirts.length > 0 && (
          <div className='mt-6 flex flex-col items-center justify-between gap-4 rounded-lg border border-white/10 bg-[#0b0f17] p-4 sm:flex-row'>
            <p className='text-sm text-slate-400'>
              Página {currentPage} de{' '}
              {totalPages}
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
                      currentPage === page
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
      </section>
    </div>
  )
}

export default PublicInventoryModal
