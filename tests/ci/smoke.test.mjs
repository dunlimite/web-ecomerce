import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const read = (relativePath) => readFileSync(resolve(relativePath), 'utf8')
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const requiredRoutes = [
  '/',
  '/products',
  '/product/:id',
  '/cart',
  '/orders',
  '/payment',
  '/about',
  '/faq',
  '/contact',
]

const requiredReducers = ['auth', 'popup', 'cart', 'product', 'order']

test('package.json exposes CI scripts', () => {
  const packageJson = JSON.parse(read('package.json'))
  for (const scriptName of ['lint:ci', 'test:ci', 'build:ci', 'audit:ci']) {
    assert.ok(packageJson.scripts[scriptName], `Missing npm script: ${scriptName}`)
  }
})

test('application route map includes core storefront pages', () => {
  const appSource = read('src/App.jsx')

  for (const route of requiredRoutes) {
    assert.match(appSource, new RegExp(`path=\\"${escapeRegExp(route)}\\"`))
  }
})

test('redux store wires all expected reducers', () => {
  const storeSource = read('src/store/store.js')

  for (const reducerName of requiredReducers) {
    assert.match(storeSource, new RegExp(`${reducerName}:`))
  }
})

test('seed product catalog contains multiple categories', () => {
  const productDataSource = read('src/data/products.js')
  const categoryMatches = productDataSource.match(/id:\s*"\d+"/g) ?? []

  assert.ok(categoryMatches.length >= 8, 'Expected at least 8 seeded storefront categories')
})
