function processTooLongSymbols(content: string) {
  const match = content.match(/^(.)\1{6,20}$/)
  if (match)
    return `${content.slice(0, 6)}...`
  return content
}

export {
  processTooLongSymbols,
}
