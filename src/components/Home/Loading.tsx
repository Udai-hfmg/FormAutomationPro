import { useEffect, useState } from 'react'
import { DNA } from 'react-loader-spinner'
import { motion, AnimatePresence } from 'framer-motion'

const QUOTES = [
    { text: "Nurses dispense comfort, compassion, and caring without even a prescription.", author: "Val Saintsbury" },
    { text: "The trained nurse has become one of the great blessings of humanity.", author: "William Osler" },
    { text: "Caring is the essence of nursing.", author: "Jean Watson" },
    { text: "To do what nobody else will do, in a way that nobody else can — that is what being a nurse is.", author: "Rawsi Williams" },
    { text: "Nurses are the heart of healthcare.", author: "Donna Wilk Cardillo" },
    { text: "The character of the nurse is as important as the knowledge she possesses.", author: "Carolyn Jarvis" },
    { text: "A nurse is not what you do. It is what you are.", author: "Unknown" },
]

const Loading = () => {
    const [quoteIndex, setQuoteIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setQuoteIndex(prev => (prev + 1) % QUOTES.length)
        }, 4000)

        return () => clearInterval(interval)
    }, [])

    const quote = QUOTES[quoteIndex]

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-50/90 backdrop-blur-sm z-[9999] px-4 font-sans">
            <DNA
                visible={true}
                height={120}
                width={120}
                ariaLabel="loading"
            />

            <div className="h-24 mt-6 flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={quoteIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="text-center max-w-lg"
                    >
                        <p className="text-gray-700 text-lg md:text-xl italic font-medium leading-relaxed">
                            "{quote.text}"
                        </p>
                        <p className="text-[#1c5441] text-sm md:text-base mt-3 font-semibold tracking-wide">
                            — {quote.author}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}

export default Loading
