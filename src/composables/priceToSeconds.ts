function priceToSeconds(price: number) {
  if (price <= 2000)
    return 5
  if (price <= 10000)
    return 10
  if (price <= 30000)
    return 30
  if (price <= 100000)
    return 60
  if (price <= 300000)
    return 180
  return 300
}

export {
  priceToSeconds,
}
