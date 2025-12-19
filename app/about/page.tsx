export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 py-16 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
                    <h1 className="text-4xl font-bold text-white mb-6">
                        Acerca del Sistema
                    </h1>

                    <div className="space-y-6 text-gray-300">
                        <section>
                            <h2 className="text-2xl font-semibold text-purple-400 mb-3">
                                ¿Qué es Twilio Flex?
                            </h2>
                            <p className="leading-relaxed">
                                Twilio Flex es una plataforma de centro de contacto programable y
                                completamente personalizable que te permite crear experiencias de
                                atención al cliente únicas adaptadas a las necesidades de tu negocio.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-purple-400 mb-3">
                                Características Principales
                            </h2>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Gestión de llamadas entrantes y salientes en tiempo real</li>
                                <li>Interfaz de agente intuitiva y personalizable</li>
                                <li>Integración con sistemas CRM y bases de datos</li>
                                <li>Análisis y reportes en tiempo real</li>
                                <li>Soporte para múltiples canales (voz, SMS, chat, etc.)</li>
                                <li>Escalabilidad empresarial</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-purple-400 mb-3">
                                Recursos Adicionales
                            </h2>
                            <div className="space-y-2">
                                <a
                                    href="https://www.twilio.com/docs/flex"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-pink-400 hover:text-pink-300 transition-colors"
                                >
                                </a>
                                <a
                                    href="https://www.twilio.com/console"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-pink-400 hover:text-pink-300 transition-colors"
                                >
                                     Consola de Twilio
                                </a>
                                <a
                                    href="https://support.twilio.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-pink-400 hover:text-pink-300 transition-colors"
                                >
                                     Soporte de Twilio
                                </a>
                            </div>
                        </section>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-700">
                        <a
                            href="/"
                            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                        >
                            ← Volver al inicio
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
