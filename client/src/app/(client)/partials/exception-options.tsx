'use client'
const options = [
    {
        id: 1,
        title: 'En registros secuenciales',
    },
    {
        id: 2,
        title: 'Integridad de campos'
    },
    {
        id: 3,
        title: 'Integridad de tablas'
    },
    {
        id: 3,
        title: 'Personalizados'
    }
]
const ExceptionOptions = () => {
    return (
        <section
            className="border-2 border-dashed rounded-md py-5 px-3 w-full gap-5 grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1"

        >
            {
                options.map((value, index) => {
                    return (
                        <article key={value.id} className="flex bg-white p-5 items-center gap-3 shadow-md rounded-lg h-24 cursor-pointer transition-all ease-in-out duration-300 hover:bg-accent">
                            <h3>
                                {value.title}
                            </h3>
                        </article>
                    )
                })
            }
        </section>
    )
}

export default ExceptionOptions