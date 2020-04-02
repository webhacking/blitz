import {permit} from '@blitzjs/core'
import {UserContext} from '@blitzjs/core/types'
import {Product, ProductUpdateInput} from 'app/product/ProductModel'



export default async function(data: Omit<ProductUpdateInput, 'store'>, user?: UserContext) {
  // Can do any pre-processing here or trigger events

  const product = await Product.user(user).update({
    where: {id: data.id},
    data: permit(data, 'name', 'description', 'price'),
  })

  // Can do any post-processing here or trigger events

  return product
}
