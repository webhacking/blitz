// pages/products/[id].tsx
import {GetStaticProps} from 'next'
import {PromiseReturnType} from '@prisma/client'
import getProduct from 'app/product/queries/getProduct'

export const getStaticProps = async context => {
  const product = await getProduct({where: {id: 1}})

  if (!product) throw new Error('Missing product!')

  return {props: {product}}
}

export default function(props: PromiseReturnType<typeof getStaticProps>['props']) {
  return (
    <div>
      <h1>{props.product.name}</h1>
    </div>
  )
}
