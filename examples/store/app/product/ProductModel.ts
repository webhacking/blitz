import {model, v} from '@blitzjs/core'
import db from 'prisma/db'
// todo: can we configure TS so that prisma client types are always in scope?
import {Product as PrismaProduct, User, Store} from '@prisma/client'
export * from '@prisma/client'

export const Product = model({
  // delegate is optional for non-persisted models
  delegate: db.product,
  validate: v`{
    name: string               :: "Name must be a string"
          & string[>3]         :: "Name must be longer than 3 characters",
  }`,
  // todo: add DSL for authorization
  authorize: ({user, op, data}) => (op === 'read' ? true : user.roles.includes('admin')),
  authorize: {
    scope: 'product', // generates product:create, product:read, product:update, product:delete
  },
  fields: {
    displaySlug: ({name}) => name?.toLowerCase().replace(' ', '-'),
  },
})

const roles = {
  Anonymous: ['product:r', 'category:r'],
  Customer: ['product:r', 'category:r', 'order:c'],
  'Store Employee': ['product:r', 'category:r', 'customer:r', 'order:ru'],
  'Store Manager': ['product:crud', 'category:crud', 'customer:crud', 'order:crud'],
}

const Repo = {
  owner: 'crud',
  member: ['ru', (repo, session) => ({where: {memberships: {include: {userId: session.user.id}}}})]
  public: ['r', (repo) => !!repo.public)]
  public: {w}
}

// db.product.findMany({where: {}})
const r = await db.user.findOne({where: {id: 1}}).memberships()


// "read" = "get" + "list"

const rules = {
  context: (user: User) {
      const storeIds = (await db.user.findOne({where: {id: user.id}}).memberships()).map(m => m.storeId)
      return {storeIds}
  },
  public: {
    "product:read": true,
  },
  owner: {
    "store:manage": async ({user, store}: {user: User, store: Store}) => {
      const storeIds = (await db.user.findOne({where: {id: user.id}}).memberships()).map(m => m.storeId)
      return storeIds.includes(store.id)
    },
    "product:manage": async ({user, product}: {user: User, product: PrismaProduct}) => {
      const storeIds = (await db.user.findOne({where: {id: user.id}}).memberships()).map(m => m.storeId)
      return storeIds.includes(product.id)
    }
  }
}
