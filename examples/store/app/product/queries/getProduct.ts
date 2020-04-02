import {UserContext} from '@blitzjs/core/types'
import {Product, FindOneProductArgs} from 'app/product/ProductModel'
import db from 'prisma/db'

export default async function(args: FindOneProductArgs, user?: UserContext) {
  // Can do any pre-processing here or trigger events

  const product = await db.product.findOne(args)

  // Can do any post-processing here or trigger events

  return product
}
