import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
            <div className="text-center space-y-8 p-8">
                <div className="space-y-4">
                    <h1 className="text-6xl font-bold text-white mb-4 animate-fade-in">
                        Twilio Flex Call Center
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Sistema de centro de llamadas integrado con Twilio Flex para gestionar
                        llamadas entrantes y salientes de manera profesional.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
                    <Link
                        href="/screener/calls"
                        className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-in-out"
                    >
                        <span className="relative z-10">Ir al Centro de Llamadas</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>

                    <Link
                        href="/about"
                        className="px-8 py-4 bg-gray-800 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-700 transform hover:scale-105 transition-all duration-300 ease-in-out border border-gray-700"
                    >
                        Acerca de
                    </Link>
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-colors duration-300">
                        <div className="text-4xl mb-4"></div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                            Llamadas en Tiempo Real
                        </h3>
                        <p className="text-gray-400">
                            Recibe y gestiona llamadas instantáneamente con Twilio Flex
                        </p>
                    </div>

                    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-colors duration-300">
                        <div className="text-4xl mb-4"></div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                            Interfaz Intuitiva
                        </h3>
                        <p className="text-gray-400">
                            Panel de control fácil de usar para agentes y supervisores
                        </p>
                    </div>

                    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-colors duration-300">
                        <div className="text-4xl mb-4"></div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                            Seguro y Confiable
                        </h3>
                        <p className="text-gray-400">
                            Infraestructura de Twilio para máxima seguridad y disponibilidad
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
