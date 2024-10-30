import { useState, useEffect, useContext } from 'react';
import { Context } from '../context/Context';

export default function Calculator() {
    const ContextValue = useContext(Context);
    const [section, setSection] = useState('BCV');
    const [bsAmount, setBsAmount] = useState('');
    const [usdAmount, setUsdAmount] = useState('1');
    const [dollarBcv, setDollarBcv] = useState('');
    const [lastUpdated, setLastUpdated] = useState('');

    useEffect(() => {
        const initializeBsAmount = () => {
            if (ContextValue.bcvData.price !== undefined) {
                setBsAmount(ContextValue.bcvData.price);
            } 
        };
        initializeBsAmount();
    }, [ContextValue.bcvData.price]);

    useEffect(() => {
        setLastUpdated(ContextValue.bcvData.last_update)
    }, [ContextValue.bcvData]);

    const ChangeSection = (e) => {
        const sectionValue = e.target.value;
        if (sectionValue === 'BCV') {
            setUsdAmount('1')
            setBsAmount(ContextValue.bcvData.price)
            setLastUpdated((ContextValue.bcvData.last_update).replace(',', ' |'))
        } else if (sectionValue === 'Paralelo') {
            setLastUpdated((ContextValue.paraleloData.last_update).replace(',', ' |'))
            setUsdAmount('1')
            setBsAmount(ContextValue.paraleloData.price)
        } else if (sectionValue === 'Equivalent') {
            setUsdAmount('1')
            const result = (1 * ContextValue.paraleloData.price);
            setBsAmount(result);
            setDollarBcv(truncateToTwoDecimals(result / ContextValue.bcvData.price).toString());
            setLastUpdated(ContextValue.paraleloData.last_update + ' | ' + ContextValue.bcvData.last_update)
        }
        setSection(sectionValue);
        setUsdAmount('1');
    };

    const truncateToTwoDecimals = (value) => {
        const number = parseFloat(value);
        if (isNaN(number)) return '0.00';
        return (Math.floor(number * 100) / 100).toFixed(2);
    };    

    const handleDollarChange = (e) => {
        const dollarValue = e.target.value.replace(',', '.');
        setUsdAmount(dollarValue);
        if (section === 'BCV' && ContextValue.bcvData.price) {
            setBsAmount(truncateToTwoDecimals(dollarValue * ContextValue.bcvData.price).toString());
        } else if (section === 'Paralelo' && ContextValue.paraleloData.price) {
            setBsAmount(truncateToTwoDecimals(dollarValue * ContextValue.paraleloData.price).toString());
        } else if (section === 'Equivalent' && ContextValue.paraleloData.price) {
            const result = dollarValue * ContextValue.paraleloData.price;
            setBsAmount(truncateToTwoDecimals(result).toString());
            setDollarBcv(truncateToTwoDecimals(result / ContextValue.bcvData.price).toString());
        }
    };
    
    const handleBsChange = (e) => {
        const bsValue = e.target.value.replace(',', '.');
        setBsAmount(bsValue);
        if (section === 'BCV' && ContextValue.bcvData.price) {
            setUsdAmount(truncateToTwoDecimals(bsValue / ContextValue.bcvData.price).toString());
        } else if (section === 'Paralelo' && ContextValue.paraleloData.price) {
            setUsdAmount(truncateToTwoDecimals(bsValue / ContextValue.paraleloData.price).toString());
        } else if (section === 'Equivalent' && ContextValue.paraleloData.price) {
            setDollarBcv(bsValue);
            const result = truncateToTwoDecimals((bsValue * ContextValue.bcvData.price) / ContextValue.paraleloData.price);
            setUsdAmount(result.toString());
            setBsAmount(truncateToTwoDecimals(bsValue * ContextValue.bcvData.price).toString());
        }
    };
    
    const handleDollarBlur = () => {
        setUsdAmount((prev) => truncateToTwoDecimals(prev).toString());
    };
    
    const handleBsBlur = () => {
        setBsAmount((prev) => truncateToTwoDecimals(prev).toString());
    };     

    const sectionCalculator = () => {
        if (section === 'Equivalent') {
            return (
                <>
                    <div className="relative mt-2 rounded-md shadow-sm">
                        <button onClick={() => navigator.clipboard.writeText(usdAmount)} className="absolute inset-y-0 left-0 flex items-center bg-gray-200 px-3 rounded-l-md text-gray-700 sm:text-sm">
                            <i className="bi bi-copy"></i>
                        </button>
                        <input type="number" step="0.01" min="0" value={usdAmount} onChange={handleDollarChange} onBlur={handleDollarBlur} className="focus:ring-0 focus:outline-none focus:border-gray-300 block w-full rounded-r-md border-0 py-1.5 pl-12 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="0.00" />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-gray-500 sm:text-sm">USD PARALELO</span>
                        </div>
                    </div>
                    <div className="relative mt-2 rounded-md shadow-sm">
                        <button onClick={() => navigator.clipboard.writeText(dollarBcv)} className="absolute inset-y-0 left-0 flex items-center bg-gray-200 px-3 rounded-l-md text-gray-700 sm:text-sm">
                            <i className="bi bi-copy"></i>
                        </button>
                        <input type="number" step="0.01" min="0" value={dollarBcv} onChange={handleBsChange} onBlur={handleBsBlur} className="focus:ring-0 focus:outline-none focus:border-gray-300 block w-full rounded-r-md border-0 py-1.5 pl-12 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="0.00" />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-gray-500 sm:text-sm">USD BCV</span>
                        </div>
                    </div>
                    <div className="relative mt-2 rounded-md shadow-sm">
                        <button onClick={() => navigator.clipboard.writeText(bsAmount)} className="absolute inset-y-0 left-0 flex items-center bg-gray-200 px-3 rounded-l-md text-gray-700 sm:text-sm">
                            <i className="bi bi-copy"></i>
                        </button>
                        <input type="number" step="0.01" min="0" value={bsAmount} readOnly className="focus:ring-0 focus:outline-none focus:border-gray-300 block w-full rounded-r-md border-0 py-1.5 pl-12 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="0.00" />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-gray-500 sm:text-sm">BS. (TASA BCV)</span>
                        </div>
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <div className="relative mt-2 rounded-md shadow-sm">
                        <button onClick={() => navigator.clipboard.writeText(usdAmount)} className="absolute inset-y-0 left-0 flex items-center bg-gray-200 px-3 rounded-l-md text-gray-700 sm:text-sm">
                            <i className="bi bi-copy"></i>
                        </button>
                        <input type="number" step="0.01" min="0" value={usdAmount} onChange={handleDollarChange} onBlur={handleDollarBlur} className="focus:ring-0 focus:outline-none focus:border-gray-300 block w-full rounded-r-md border-0 py-1.5 pl-12 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="0.00" />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-gray-500 sm:text-sm">USD</span>
                        </div>
                    </div>
                    <div className="relative mt-2 rounded-md shadow-sm">
                        <button onClick={() => navigator.clipboard.writeText(bsAmount)} className="absolute inset-y-0 left-0 flex items-center bg-gray-200 px-3 rounded-l-md text-gray-700 sm:text-sm">
                            <i className="bi bi-copy"></i>
                        </button>
                        <input type="number" step="0.01" min="0" value={bsAmount} onChange={handleBsChange} onBlur={handleBsChange} className="focus:ring-0 focus:outline-none focus:border-gray-300 block w-full rounded-r-md border-0 py-1.5 pl-12 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="0.00" />
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
        <p className='text-gray-500 text-sm mt-3 text-center'>Pruébala gratis en: www.abcv.vercel.app</p>
        <div className='bg-gray-800 text-white p-4 rounded-md'>
            <h1 className='text-xl font-bold text-center'>aBCV - Calculadora</h1>
            <div className='text-center mb-2'>
                <select onChange={ChangeSection} className="w-100 h-full rounded-md border-0  py-0 pl-2 pr-7 text-gray-500 sm:text-sm">
                    <option value="BCV">BCV</option>
                    <option value="Paralelo">Paralelo</option>
                    <option value="Equivalent">Equivalentes</option>
                </select> <br />
            </div>
            {sectionCalculator()}
            <p className='text-gray-500 text-sm mt-3 text-center'>
                ÚLTIMA ACTUALIZACIÓN <br />
                {lastUpdated ? lastUpdated : ''}
            </p>
        </div>
        <div className='text-center text-gray-500'>
            <a href="https://github.com/itsJefryTz/aBCV" target='_blank'><i className="bi bi-github"></i></a>
        </div>
        </>
    );
}