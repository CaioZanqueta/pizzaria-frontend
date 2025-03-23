"use client"

import { use, useEffect, useRef } from 'react'
import styles from './styles.module.scss'
import { RefreshCw } from 'lucide-react'
import { OrderProps } from '@/lib/order.type'
import { ModalOrder } from '@/app/dashboard/components/modal'
import { OrderContext } from '@/providers/order'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface Props {
  orders: OrderProps[]
}

export function Orders({ orders }: Props) {
  const { isOpen, onRequestOpen } = use(OrderContext)
  const router = useRouter()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  async function handleDetailOrder( order_id: string ) {
    await onRequestOpen(order_id)
  }

  function handleRefresh() {
    router.refresh()
    toast.success("Pedidos atualizados")
    resetInterval() // Reseta o timer ao atualizar manualmente
  }

  function resetInterval() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      handleRefresh()
    }, 30 * 1000) // 30 segundos em milissegundos
  }

  useEffect(() => {
    resetInterval() // Inicia o intervalo ao montar

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    } // Limpa o intervalo ao desmontar
  }, [])

  return (
    <>
      <main className={styles.container}>

        <section className={styles.containerHeader}>
          <h1>Últimos Pedidos</h1>
          <button onClick={handleRefresh}>
            <RefreshCw size={24} color='#3fffa3'/>
          </button>
        </section>

        <section className={styles.listOrders}>
          {orders.length === 0 && (
            <span className={styles.emptyItem}>
              Nenhum pedido aberto no momento...
            </span>
          ) }

          {orders.map( order => (
            <button
              key={order.id}
              className={styles.orderItem}
              onClick={ () => handleDetailOrder(order.id) }
            >
              <div className={styles.tag}></div>
              <span>Mesa {order.table}</span>
            </button>
          ) )}
        </section>

      </main>

      { isOpen && <ModalOrder /> }
    </>
  )
}