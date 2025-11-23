import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { name, email } = await req.json()

    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: {
        name,
        email,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('User update error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
