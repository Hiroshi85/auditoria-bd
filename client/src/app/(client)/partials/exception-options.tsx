'use client'
import Link from "next/link"
type Props = {
    tableName: string
}
const ExceptionOptions = ({ tableName }: Props) => {
    const options = [
        {
            id: 1,
            title: 'En registros secuenciales',
            route: '/secuencialidad'
        },
        {
            id: 2,
            title: 'Integridad de campos',
            route: '/integridad/campos'
        },
        {
            id: 3,
            title: 'Integridad de tablas',
            route: '/integridad/tablas'
        },
        {
            id: 3,
            title: 'Personalizados',
            route: '/personalizados'
        }
    ]
    return (
        <section
            className="border-2 border-dashed rounded-md py-5 px-3 w-full gap-5 grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1"

        >
            {
                options.map((value) => {
                    return (
                        <Link
                            href={{
                                pathname: value.route,
                                query: { table: tableName },
                            }}
                            key={value.id} className="flex bg-white p-5 items-center gap-3 shadow-md rounded-lg h-24 cursor-pointer transition-all ease-in-out duration-300 hover:bg-accent">
                            <h3>
                                {value.title}
                            </h3>
                        </Link>
                    )
                })
            }
        </section>
    )
}

export default ExceptionOptions