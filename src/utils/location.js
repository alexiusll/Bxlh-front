export const getSampleId = () => {
  const { pathname, hash } = window.location

  if (hash) {
    const path_list = hash.split('/')

    return parseInt(path_list[path_list.indexOf('sample') + 1], 10)
  }

  const path_list = pathname.split('/')

  return parseInt(path_list[path_list.indexOf('sample') + 1], 10)
}

export const getProjectId = () => {
  const { pathname } = window.location

  return parseInt(pathname[pathname.indexOf('p') + 1])
}
