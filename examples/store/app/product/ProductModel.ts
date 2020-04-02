import {model, v} from '@blitzjs/core'
import db from 'prisma/db'
// todo: can we configure TS so that prisma client types are always in scope?
import {Product as PrismaProduct} from '@prisma/client'
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
