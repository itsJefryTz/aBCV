import { useState, useContext } from 'react';
import { Context } from '../context/Context';

export default function Calculator() {
    const ContextValue = useContext(Context);
    const [section, setSection] = useState('BCV');
    const [dollarBcv, setDollarBcv] = useState('');

    const ChangeSection = (e) => {
        const sectionValue = e.target.value;
        setSection(sectionValue);
        ContextValue.setUsdAmount('1');
    };

    const handleDollarChange = (e) => {
        const dollarValue = e.target.value.replace(',', '.');
        ContextValue.setUsdAmount(dollarValue);
        if (section === 'BCV' && ContextValue.bcvData.price) {
            ContextValue.setBsAmount((dollarValue * ContextValue.bcvData.price).toFixed(4));
        } else if (section === 'Paralelo' && ContextValue.paraleloData.price) {
            ContextValue.setBsAmount((dollarValue * ContextValue.paraleloData.price).toFixed(4));
        } else if (section === 'DollarParaleloToABCV' && ContextValue.paraleloData.price) {
            const result = (dollarValue * ContextValue.paraleloData.price).toFixed(4);
            ContextValue.setBsAmount(result);
            setDollarBcv((result / ContextValue.bcvData.price).toFixed(4));
        }
    };

    const handleBsChange = (e) => {
        const bsValue = e.target.value.replace(',', '.');
        ContextValue.setBsAmount(bsValue);
        if (section === 'BCV' && ContextValue.bcvData.price) {
            ContextValue.setUsdAmount((bsValue / ContextValue.bcvData.price).toFixed(4));
        } else if (section === 'Paralelo' && ContextValue.paraleloData.price) {
            ContextValue.setUsdAmount((bsValue / ContextValue.paraleloData.price).toFixed(4));
        } else if (section === 'DollarParaleloToABCV' && ContextValue.paraleloData.price) {
            setDollarBcv(bsValue)
            const result = ((bsValue * ContextValue.bcvData.price) / ContextValue.paraleloData.price).toFixed(4);
            ContextValue.setUsdAmount(result);
            ContextValue.setBsAmount((bsValue * ContextValue.bcvData.price).toFixed(4));
        }
    };

    const sectionCalculator = () => {
        if (section === 'DollarParaleloToABCV') {
            return (
                <>
                    <div className="relative mt-2 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input type="number" step="0.01" value={ContextValue.usdAmount} onChange={handleDollarChange} className="block w-full rounded-md border-0 py-1.5 pl-10 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="0.00" />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-gray-500 sm:text-sm">USD PARALELO</span>
                        </div>
                    </div>
                    <div className="relative mt-2 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input type="number" step="0.01" value={dollarBcv} onChange={handleBsChange} className="block w-full rounded-md border-0 py-1.5 pl-10 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="0.00" />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-gray-500 sm:text-sm">USD BCV</span>
                        </div>
                    </div>
                    <div className="relative mt-2 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-900 sm:text-sm">Bs.</span>
                        </div>
                        <input type="number" step="0.01" value={ContextValue.bsAmount} disabled className="block w-full rounded-md border-0 py-1.5 pl-10 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="0.00" />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-gray-900 sm:text-sm">BS. (TASA BCV)</span>
                        </div>
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <div className="relative mt-2 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input type="number" step="0.01" value={ContextValue.usdAmount} onChange={handleDollarChange} className="block w-full rounded-md border-0 py-1.5 pl-10 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="0.00" />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-gray-500 sm:text-sm">USD</span>
                        </div>
                    </div>
                    <div className="relative mt-2 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-500 sm:text-sm">Bs.</span>
                        </div>
                        <input type="number" step="0.01" value={ContextValue.bsAmount} onChange={handleBsChange} className="block w-full rounded-md border-0 py-1.5 pl-10 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="0.00" />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-gray-500 sm:text-sm">BS.</span>
                        </div>
                    </div>
                </>
            );
        }
    };

    return (
        <>
        <div className='bg-gray-800 text-white p-4 rounded-md'>
            <h1 className='text-xl font-bold text-center'>aBCV - Calculadora</h1>
            <div className='text-center mb-2'>
                <select onChange={ChangeSection} className="w-100 h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 sm:text-sm">
                    <option value="BCV">BCV</option>
                    <option value="Paralelo">Paralelo</option>
                    <option value="DollarParaleloToABCV">$ Paralelo a BCV</option>
                </select> <br />
            </div>
            {sectionCalculator()}
        </div>
        <p className='text-gray-500 text-sm mt-3 text-center'>
            Última Actualización <br />
            {ContextValue.data.datetime ? (
                <>
                    {ContextValue.data.datetime.date} <br />
                    {ContextValue.data.datetime.time}
                </>
            ) : (
                "No data available"
            )}
        </p>
        </>
    );
}