export default function DeleteCursos() {
    return (
        <>
        <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4">Eliminar Curso</h1>
        <p>¿Estás seguro de que deseas eliminar este curso?</p>
        <div className="mt-4">
            <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
            Eliminar
            </button>
        </div>
        </div>
        </>
    );
}