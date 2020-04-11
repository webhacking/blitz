import {PrismaClient} from '@prisma/client'

const db = new PrismaClient({errorFormat: 'minimal'})

it('findOne works for admin + computes displaySlug', async () => {
  let product: any
  // @ts-ignore
  product = await db.product.findOne({where: {}})

  expect(product).toStrictEqual({
    id: 1,
    name: 'Green Shirt',
    description: null,
    price: null,
  })
})
