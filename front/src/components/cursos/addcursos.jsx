export default function AddCursos() {
    return (
        <>
        <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4">Cursos Page</h1>
        <p>Welcome to the cursos page!</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-gray-200 p-4 rounded hover:bg-gray-300 transition-colors">
            <h2 className="text-lg font-semibold">Curso 1</h2>
            <p className="text-sm text-gray-600">Descripción del curso 1.</p>
            </div>
            <div className="bg-gray-200 p-4 rounded hover:bg-gray-300 transition-colors">
            <h2 className="text-lg font-semibold">Curso 2</h2>
            <p className="text-sm text-gray-600">Descripción del curso 2.</p>
            </div>
            <div className="bg-gray-200 p-4 rounded hover:bg-gray-300 transition-colors">
            <h2 className="text-lg font-semibold">Curso 3</h2>
            <p className="text-sm text-gray-600">Descripción del curso 3.</p>
            </div>
        </div>
        </div>
        </>
    );
}