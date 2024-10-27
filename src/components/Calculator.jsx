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
                    <div>
                        <div className="relative mt-2 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className="text-gray-900 sm:text-sm">$</span>
                            </div>
                            <input id="price" type="number" step="0.01" placeholder="0.00" value={ContextValue.usdAmount} onChange={handleDollarChange} className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                            <div className="absolute inset-y-0 right-0 flex items-center">
                                <label htmlFor="currency" className="sr-only">Currency</label>
                                <select disabled id="currency" className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm">
                                    <option>USD PARALELO</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="relative mt-2 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className="text-gray-900 sm:text-sm">$</span>
                            </div>
                            <input id="price" type="number" step="0.01" placeholder="0.00" value={dollarBcv} onChange={handleBsChange} className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                            <div className="absolute inset-y-0 right-0 flex items-center">
                                <label htmlFor="currency" className="sr-only">Currency</label>
                                <select disabled id="currency" className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm">
                                    <option>USD BCV</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="relative mt-2 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className="text-gray-900 sm:text-sm">Bs</span>
                            </div>
                            <input disabled id="price" type="number" step="0.01" placeholder="0.00" value={ContextValue.bsAmount} className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                            <div className="absolute inset-y-0 right-0 flex items-center">
                                <label htmlFor="currency" className="sr-only">Currency</label>
                                <select disabled id="currency" className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-900 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm">
                                    <option>BS (TASA BCV)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <div>
                        <div className="relative mt-2 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className="text-gray-900 sm:text-sm">$</span>
                            </div>
                            <input id="price" type="number" step="0.01" placeholder="0.00" value={ContextValue.usdAmount} onChange={handleDollarChange} className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                            <div className="absolute inset-y-0 right-0 flex items-center">
                                <label htmlFor="currency" className="sr-only">Currency</label>
                                <select disabled id="currency" className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm">
                                    <option>USD</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="relative mt-2 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className="text-gray-900 sm:text-sm">Bs</span>
                            </div>
                            <input id="price" type="number" step="0.01" placeholder="0.00" value={ContextValue.bsAmount} onChange={handleBsChange} className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                            <div className="absolute inset-y-0 right-0 flex items-center">
                                <label htmlFor="currency" className="sr-only">Currency</label>
                                <select disabled id="currency" className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm">
                                    <option>BS</option>
                                </select>
                            </div>
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