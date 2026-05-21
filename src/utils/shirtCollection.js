export const shirtsPerPage = 6

export const getShirtTitle = (shirt) =>
  shirt.shirtName ||
  shirt.name ||
  shirt.team ||
  'Camiseta'

export const compareText = (a, b) =>
  String(a || '').localeCompare(
    String(b || ''),
    'es',
    {
      sensitivity: 'base',
    }
  )

export const sortShirts = (shirts) =>
  [...shirts].sort((a, b) => {
    const byLeague = compareText(
      a.league,
      b.league
    )

    if (byLeague !== 0) return byLeague

    const byTeam = compareText(
      a.team,
      b.team
    )

    if (byTeam !== 0) return byTeam

    const byName = compareText(
      getShirtTitle(a),
      getShirtTitle(b)
    )

    if (byName !== 0) return byName

    return compareText(
      a.season,
      b.season
    )
  })

export const uniqueSorted = (values) =>
  [
    ...new Set(
      values.filter(Boolean)
    ),
  ].sort(compareText)

export const shirtMatchesSearch = (
  shirt,
  search
) => {
  const text = [
    getShirtTitle(shirt),
    shirt.team,
    shirt.league,
    shirt.season,
    shirt.playerName,
    shirt.shirtNumber,
    shirt.size,
  ]
    .join(' ')
    .toLowerCase()

  return text.includes(
    String(search || '').toLowerCase()
  )
}

export const filterShirts = (
  shirts,
  { search = '', league = '', season = '', team = '' } = {}
) =>
  sortShirts(
    shirts.filter(
      (shirt) =>
        shirtMatchesSearch(shirt, search) &&
        (!league ||
          shirt.league === league) &&
        (!season ||
          shirt.season === season) &&
        (!team || shirt.team === team)
    )
  )

export const getFilterValues = (
  shirts,
  { search = '', league = '', season = '', team = '' } = {}
) => {
  const shirtsForOption = (
    excludedFilter
  ) =>
    shirts.filter(
      (shirt) =>
        shirtMatchesSearch(shirt, search) &&
        (excludedFilter ===
          'league' ||
          !league ||
          shirt.league === league) &&
        (excludedFilter ===
          'season' ||
          !season ||
          shirt.season === season) &&
        (excludedFilter === 'team' ||
          !team ||
          shirt.team === team)
    )

  return {
    leagues: uniqueSorted(
      shirtsForOption('league').map(
        (shirt) => shirt.league
      )
    ),
    seasons: uniqueSorted(
      shirtsForOption('season').map(
        (shirt) => shirt.season
      )
    ),
    teams: uniqueSorted(
      shirtsForOption('team').map(
        (shirt) => shirt.team
      )
    ),
  }
}

export const getVisiblePages = (
  currentPage,
  totalPages
) => {
  const visiblePages = new Set([
    1,
    totalPages,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ])

  return [...visiblePages]
    .filter(
      (page) =>
        page >= 1 &&
        page <= totalPages
    )
    .sort((a, b) => a - b)
    .reduce((pages, page) => {
      const previous =
        pages[pages.length - 1]

      if (
        previous &&
        page - previous > 1
      ) {
        pages.push(`ellipsis-${page}`)
      }

      pages.push(page)
      return pages
    }, [])
}
